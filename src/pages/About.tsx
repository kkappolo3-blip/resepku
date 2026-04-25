import { Info, Heart, Sparkles, ChefHat, ArrowLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="container mx-auto px-4 pt-6 pb-4 max-w-3xl">
        <NavLink to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </NavLink>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16 max-w-3xl">
        <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-warm border border-border/50">
          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <img 
              src={logo} 
              alt="Logo Gibikey Studio" 
              className="h-20 w-20 object-contain mb-4" 
            />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Tentang Resepku
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              oleh Gibikey Studio
            </p>
          </div>

          {/* What is Resepku */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Apa itu Resepku?</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Resepku adalah aplikasi pintar yang membantu kamu menemukan ide masakan berdasarkan bahan-bahan yang sudah ada di dapur. Cukup ketik bahan yang kamu punya, dan AI akan memberikan resep lengkap dengan langkah-langkah memasak.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Cara Penggunaan</h2>
                <ol className="mt-1 text-sm text-muted-foreground leading-relaxed list-decimal list-inside space-y-1">
                  <li>Ketik bahan yang kamu punya di kolom input</li>
                  <li>Tekan Enter atau klik "Tambah" untuk menambahkan bahan</li>
                  <li>Klik "Cari resep yang bisa dibuat" untuk mendapatkan ide masakan</li>
                  <li>Simpan resep favoritmu dengan menekan ikon hati ❤️</li>
                  <li>Bagikan resep ke WhatsApp untuk teman atau keluarga</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                <Info className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Tentang Gibikey Studio</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Gibikey Studio adalah tim kreatif yang berfokus pada pengembangan aplikasi digital inovatif. Kami percaya bahwa teknologi harus memudahkan kehidupan sehari-hari — termasuk memasak! Resepku adalah salah satu produk kami yang dirancang dengan ❤️ untuk pecinta masakan Indonesia.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Ucapan Terima Kasih</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Terima kasih telah menggunakan Resepku! Kami harap aplikasi ini membantu kamu menemukan inspirasi masakan baru. Jika ada saran atau masukan, jangan ragu untuk menghubungi kami.
                </p>
              </div>
            </div>
          </div>

          {/* Logo Credentials */}
          <div className="mt-8 p-5 rounded-2xl bg-muted/50 border border-border/30">
            <div className="flex items-start gap-4">
              <img 
                src={logo} 
                alt="Logo Gibikey Studio" 
                className="h-12 w-12 object-contain shrink-0" 
              />
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Kredensial Logo</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Logo dan identitas visual Gibikey Studio merupakan hak cipta milik Gibikey Studio. Logo ini digunakan secara eksklusif untuk aplikasi Resepku dan produk-produk digital lainnya yang dikembangkan oleh tim Gibikey Studio.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Gibikey Studio. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Gibikey Studio. Dibuat dengan ❤️ di Indonesia.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
