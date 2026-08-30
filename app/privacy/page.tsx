import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | SaAyat",
  description: "Kebijakan privasi SaAyat untuk penggunaan aplikasi latihan hafalan Al-Qur'an.",
};

const sections = [
  {
    title: "Informasi yang Kami Gunakan",
    content: [
      "SaAyat menggunakan informasi yang antum berikan secara langsung, seperti nama tampilan akun, alamat email ketika login dengan Google, serta preferensi penggunaan seperti bahasa dan pengaturan latihan.",
      "Kami juga menyimpan data penggunaan yang diperlukan agar fitur utama berjalan dengan baik, misalnya skor, streak, histori sesi, dan pengaturan latihan yang antum pilih.",
    ],
  },
  {
    title: "Cara Informasi Dipakai",
    content: [
      "Informasi tersebut dipakai untuk mengautentikasi akun, menjaga sesi login, menyimpan progres latihan, menampilkan leaderboard, dan meningkatkan pengalaman penggunaan aplikasi.",
      "Kami tidak menjual data pribadi antum. Data hanya dipakai untuk operasional SaAyat dan analitik dasar yang membantu kami memahami performa layanan.",
    ],
  },
  {
    title: "Penyimpanan dan Keamanan",
    content: [
      "Data akun dan progres disimpan pada layanan backend yang kami gunakan untuk menjalankan SaAyat. Kami berupaya menjaga data tetap aman dengan praktik keamanan yang wajar, tetapi tidak ada sistem yang bisa dijamin 100% bebas risiko.",
    ],
  },
  {
    title: "Hak Pengguna",
    content: [
      "Antum dapat berhenti menggunakan layanan kapan saja. Jika tersedia di pengaturan akun, antum juga dapat memperbarui nama tampilan atau menghapus akun sesuai opsi yang disediakan dalam aplikasi.",
      "Dengan tetap menggunakan SaAyat, antum menyetujui kebijakan privasi ini. Kebijakan ini dapat diperbarui dari waktu ke waktu bila ada perubahan fitur atau kebutuhan kepatuhan.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Kebijakan Privasi"
      description="Halaman ini menjelaskan bagaimana SaAyat mengumpulkan, menggunakan, dan menjaga data yang diperlukan untuk menghadirkan pengalaman latihan hafalan yang konsisten."
      updatedAt="30 Agustus 2026"
      sections={[...sections]}
    />
  );
}
