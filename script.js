// Database manual untuk strategi makro (Bisa kamu lengkapi sendiri nanti)
const strategyDb = {
    "axe": {
        skills: "Berserker's Call, Battle Hunger, Counter Helix, Culling Blade.",
        synergy: "Dazzle (Shallow Grave saat Axe maju), Invoker, Dark Seer (Vacuum ke Call).",
        counters: "Outworld Destroyer (Astral Imprisonment saat Axe Call), Viper (Break Counter Helix), Necrophos.",
        items: "Eul's Scepter (Hentikan Axe saat Call), Silver Edge (Matikan pasif Counter Helix), Spirit Vessel."
    },
    "phantom assassin": {
        skills: "Stifling Dagger, Phantom Strike, Blur, Fan of Knives, Coup de Grace.",
        synergy: "Magnus (Empower), Crystal Maiden (Mana Regen), Omniknight.",
        counters: "Moriah/Razor (Static Link), Axe (Call menembus Blur), Timbersaw (Burst damage tinggi).",
        items: "Monkey King Bar (Bypass kelemahan Miss Blur), Ghost Scepter (Anti Physical Hit), Blade Mail."
    }
    // Tambahkan data hero lainnya di sini dengan format huruf kecil semua
};

document.getElementById('searchBtn').addEventListener('click', searchHero);
document.getElementById('heroSearch').addEventListener('keypress', function(e) {
    if (e.key === 'key') {
        if (e.key === 'Enter') searchHero();
    }
});

async function searchHero() {
    const query = document.getElementById('heroSearch').value.toLowerCase().trim();
    if (!query) return;

    try {
        // Ambil data resmi dari OpenDota API
        const response = await fetch('https://api.opendota.com/api/heroStats');
        const heroes = await response.json();
        
        // Cari hero yang cocok
        const hero = heroes.find(h => h.localized_name.toLowerCase() === query);

        if (hero) {
            // Tampilkan Container
            document.getElementById('resultContainer').classList.remove('hidden');
            
            // Isi data dari API
            document.getElementById('heroName').innerText = hero.localized_name;
            document.getElementById('heroType').innerText = `${hero.primary_attr.toUpperCase()} - ${hero.attack_type}`;
            document.getElementById('heroImage').src = `https://cdn.cloudflare.steamstatic.com${hero.img}`;

            // Ambil data analisis dari database lokal kita
            const strategy = strategyDb[query] || {
                skills: "Data skill belum dimasukkan.",
                synergy: "Data pendukung belum dianalisis.",
                counters: "Data counter belum dianalisis.",
                items: "Data item counter belum dimasukkan."
            };

            document.getElementById('heroSkills').innerText = strategy.skills;
            document.getElementById('heroSynergy').innerText = strategy.synergy;
            document.getElementById('heroCounters').innerText = strategy.counters;
            document.getElementById('itemCounters').innerText = strategy.items;

        } else {
            alert("Hero tidak ditemukan! Pastikan ejaan bahasa Inggrisnya benar (Contoh: Crystal Maiden).");
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal memuat data. Periksa koneksi internetmu.");
    }
}
