"use client";

import { useEffect, useState } from "react";
import { X, Heart, AlertTriangle, ExternalLink } from "lucide-react";

const STORAGE_KEY = "saayat_donation_popup_dismissed";

export default function DonationPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Tampilkan popup hanya jika belum pernah di-dismiss sebelumnya
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Sedikit delay agar halaman sempat render dulu
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"
          }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-popup-title"
        className={`fixed z-[101] inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-md
          bg-[var(--background)] border border-[var(--border)]
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-300
          ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        {/* Accent bar atas */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

        {/* Tombol tutup */}
        <button
          onClick={handleClose}
          aria-label="Tutup popup"
          className="absolute top-3 right-3 p-1.5 rounded-full text-[var(--muted-foreground)]
            hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60
              flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2
                id="donation-popup-title"
                className="text-base font-semibold text-[var(--foreground)] leading-snug"
              >
                Mari Jaga Saayat Bersama 🤍
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Tim Saayat
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              Assalamu'alaikum, Jazakumullah khairan telah menggunakan{" "}
              <span className="font-semibold text-[var(--foreground)]">Saayat</span>.
            </p>
            <p>
              Saat ini, <strong className="text-amber-500">server yang menopang Saayat membutuhkan perpanjangan</strong>.
              Agar layanan tetap bisa berjalan dengan baik, kami membuka kesempatan bagi Antum yang ingin ikut berkontribusi.
            </p>
            <p>
              Saayat akan tetap kami jaga <span className="font-semibold text-[var(--foreground)]">gratis, tanpa iklan, dan tanpa keuntungan</span>.
            </p>
            <p>
              Jika Allah lapangkan rezeki Antum hari ini, dukungan sekecil apapun akan menjadi bagian dari amal yang terus mengalir — selama ada satu orang yang membaca al-quran melalui Saayat.
            </p>
          </div>

          {/* Progress bar "dana hampir habis" — visual urgency */}
          <div className="mt-5 mb-4">
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1.5">
              <span>Dana tersisa</span>
              <span className="font-semibold text-amber-500">~15%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-400"
                style={{ width: "15%" }}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
            <a
              href="https://saweria.co/saayat"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-amber-400 to-orange-400
                text-white shadow-md shadow-amber-400/30
                hover:shadow-lg hover:shadow-amber-400/40 hover:-translate-y-0.5
                transition-all duration-200"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donasi Sekarang
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium
                border border-[var(--border)] text-[var(--muted-foreground)]
                hover:bg-[var(--muted)] hover:text-[var(--foreground)]
                transition-colors duration-200"
            >
              Mungkin Nanti
            </button>
          </div>

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-3 opacity-70">
            Semoga Allah membalas kebaikan Antum. 🤲
          </p>
        </div>
      </div>
    </>
  );
}
