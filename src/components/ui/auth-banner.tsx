import { Typography } from "../atoms/typography"

export const AuthBanner = () => {
    return (
        <div className="bg-rencanakan-premium-gold-300 hidden p-8 md:block md:w-1/2">
            <div className="flex h-full flex-col justify-center">
            <Typography variant="h4" className="mb-4 text-white">
                Selamat datang!
            </Typography>
            <Typography variant="p2" className="text-white">
                Talent Pool adalah fitur dari Rencanakan.id yang memungkinkan tenaga ahli di bidang
                konstruksi untuk mendaftar dan menunjukkan keterampilan mereka. Fitur ini memudahkan
                kontraktor dalam mencari dan merekrut talenta sesuai kebutuhan proyek mereka secara
                cepat dan efisien.
            </Typography>
            <Typography variant="p5" className="mt-4">
                <a
                className="cursor-pointer text-white hover:text-blue-700"
                href="https://rencanakan.id/about-us/"
                >
                Pelajari lebih lanjut
                </a>
            </Typography>
            </div>
        </div>
    )
}