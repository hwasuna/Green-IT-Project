const produits = [
    {
        nom: "Savon Bio",
        description: "Savon naturel à base d’huile d’olive.",
        categorie: "Hygiène",
        prix: 5.0,
        disponible: true
    },
    {
        nom: "Gourde Inox",
        description: "Gourde écologique 500ml",
        categorie: "Accessoires",
        prix: 15.0,
        disponible: true
    },
    {
        nom: "Sac en toile",
        description: "Sac réutilisable pour courses",
        categorie: "Textile",
        prix: 7.5,
        disponible: false
    }
];

const container = document.getElementById('catalogueContainer');

produits.forEach(produit => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <h3>${produit.nom}</h3>
        <p><strong>Description :</strong> ${produit.description}</p>
        <p><strong>Catégorie :</strong> ${produit.categorie}</p>
        <p><strong>Prix :</strong> ${produit.prix.toFixed(2)} €</p>
        <p><strong>Disponible :</strong> ${produit.disponible ? 'Oui' : 'Non'}</p>
        <button ${!produit.disponible ? 'disabled' : ''}>Ajouter au panier</button>
    `;

    container.appendChild(card);
});
