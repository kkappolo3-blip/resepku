import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { ingredients } = await req.json();
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: "Daftar bahan tidak boleh kosong." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY belum dikonfigurasi");

    const cleanList = ingredients
      .map((s: unknown) => String(s).trim())
      .filter(Boolean)
      .slice(0, 40);

    const systemPrompt = `Kamu adalah koki Indonesia berpengalaman. Tugasmu: berdasarkan bahan-bahan yang dimiliki pengguna, sarankan 4-6 resep masakan (Indonesia/Asia/umum) yang BISA dibuat. Utamakan resep yang hampir seluruh bahan utamanya tersedia. Boleh asumsikan bumbu dasar dapur (garam, gula, minyak, merica, bawang putih, bawang merah, air) selalu tersedia. Tulis dalam Bahasa Indonesia yang ramah dan jelas.`;

    const userPrompt = `Bahan yang saya punya:\n- ${cleanList.join("\n- ")}\n\nBerikan ide resep yang bisa saya masak.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_recipes",
              description: "Mengembalikan daftar resep yang bisa dibuat dari bahan yang dimiliki.",
              parameters: {
                type: "object",
                properties: {
                  recipes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Nama masakan" },
                        emoji: { type: "string", description: "Satu emoji yang mewakili masakan" },
                        description: { type: "string", description: "Deskripsi singkat 1-2 kalimat" },
                        cookTime: { type: "string", description: "Estimasi waktu masak, contoh: '25 menit'" },
                        difficulty: { type: "string", enum: ["Mudah", "Sedang", "Sulit"] },
                        servings: { type: "string", description: "Porsi, contoh: '2-3 porsi'" },
                        matchPercent: { type: "number", description: "Persentase bahan yang cocok 0-100" },
                        usedIngredients: { type: "array", items: { type: "string" }, description: "Bahan dari daftar pengguna yang dipakai" },
                        missingIngredients: { type: "array", items: { type: "string" }, description: "Bahan tambahan yang perlu dibeli (selain bumbu dapur dasar)" },
                        steps: { type: "array", items: { type: "string" }, description: "Langkah memasak singkat dan jelas" },
                      },
                      required: ["title", "emoji", "description", "cookTime", "difficulty", "servings", "matchPercent", "usedIngredients", "missingIngredients", "steps"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recipes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_recipes" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Terlalu banyak permintaan. Coba lagi sebentar." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit AI habis. Silakan tambahkan kredit di workspace Lovable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Gagal memanggil AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    const parsed = args ? JSON.parse(args) : { recipes: [] };

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-recipes error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
