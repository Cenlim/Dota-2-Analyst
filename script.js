body {
    background-color: #1c1c1c;
    color: #e5e5e5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
}

h1 {
    color: #a33333;
    font-size: 2.5rem;
    margin-bottom: 30px;
}

.search-box {
    margin-bottom: 40px;
}

#heroSearch {
    padding: 12px 20px;
    width: 60%;
    max-width: 400px;
    border: 2px solid #333;
    border-radius: 4px;
    background-color: #2b2b2b;
    color: #fff;
    font-size: 16px;
}

#searchBtn {
    padding: 12px 25px;
    background-color: #a33333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
}

#searchBtn:hover {
    background-color: #d13f3f;
}

.hidden {
    display: none !important;
}

#resultContainer {
    background-color: #252525;
    padding: 30px;
    border-radius: 8px;
    text-align: left;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.hero-header {
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 2px solid #333;
    padding-bottom: 20px;
    margin-bottom: 25px;
}

#heroImage {
    width: 120px;
    height: auto;
    border-radius: 4px;
    border: 1px solid #555;
}

.chart-container {
    background-color: #1a1a1a;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 25px;
    border: 1px solid #333;
}

.chart-container h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: #ccc;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

@media (max-width: 768px) {
    .info-grid { grid-template-columns: 1fr; }
}

.info-card {
    background-color: #1a1a1a;
    padding: 20px;
    border-radius: 6px;
    border-left: 4px solid #555;
}

.info-card h3 { margin-top: 0; color: #fff; }
.synergy { border-left-color: #2e7d32; }
.counters { border-left-color: #c62828; }
.item-counters { border-left-color: #ef6c00; }

.list-content {
    line-height: 1.6;
    font-size: 14px;
}

/* Style untuk list gambar counter */
.image-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.image-list img {
    height: 45px;
    width: auto;
    border-radius: 4px;
    border: 1px solid #444;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
