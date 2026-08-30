import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | SaAyat",
  description:
    "Syarat dan ketentuan penggunaan SaAyat untuk latihan hafalan Al-Qur'an.",
};

const sections = [
  {
    title: "Penerimaan Ketentuan",
    content: [
      "Dengan mengakses atau menggunakan SaAyat, antum menyetujui syarat penggunaan ini. Jika tidak berkenan dengan salah satu ketentuan, mohon untuk tidak menggunakan layanan.",
      "SaAyat disediakan sebagai aplikasi latihan hafalan Al-Qur'an untuk membantu murajaah, bukan sebagai pengganti pembelajaran bersama guru atau pembimbing yang terpercaya.",
    ],
  },
  {
    title: "Penggunaan Layanan",
    content: [
      "Antum setuju menggunakan layanan secara wajar dan tidak menyalahgunakan fitur, termasuk autentikasi, leaderboard, maupun mekanisme latihan yang tersedia.",
      "Kami dapat menambah, mengubah, atau menghentikan sebagian fitur sewaktu-waktu untuk perbaikan produk, pemeliharaan, keamanan, atau penyesuaian kebutuhan teknis.",
    ],
  },
  {
    title: "Akun dan Konten",
    content: [
      "Jika antum login menggunakan penyedia pihak ketiga seperti Google, antum bertanggung jawab menjaga keamanan akses akun tersebut. Data profil dasar yang dibutuhkan akan dipakai untuk menjalankan fitur akun di SaAyat.",
      "Seluruh tampilan, materi, dan pengalaman produk dalam SaAyat disediakan untuk penggunaan pribadi dan non-komersial, kecuali kami nyatakan lain secara tertulis.",
    ],
  },
  {
    title: "Batasan Tanggung Jawab",
    content: [
      "Kami berupaya menjaga layanan tetap tersedia dan akurat, namun SaAyat disediakan sebagaimana adanya. Kami tidak menjamin layanan akan selalu bebas gangguan, sepenuhnya tanpa kesalahan, atau cocok untuk setiap kebutuhan khusus.",
      "Dengan menggunakan layanan ini, antum memahami bahwa hasil latihan, skor, dan progres hafalan dapat dipengaruhi oleh koneksi internet, browser, perangkat, atau layanan pihak ketiga yang digunakan.",
    ],
  },
] as const;

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title="Syarat Layanan"
      description="Dokumen ini merangkum aturan penggunaan SaAyat agar layanan bisa terus dipakai dengan baik, adil, dan sesuai tujuan utamanya sebagai sarana latihan hafalan."
      updatedAt="30 Agustus 2026"
      sections={[...sections]}
    />
  );
}
