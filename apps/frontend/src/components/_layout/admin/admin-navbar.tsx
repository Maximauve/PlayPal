import React from "react";

export default function AdminNavbar(): React.JSX.Element {
  return (
    <main className="admin-navbar">
      <div className="nav-logo">
        <p>PlayPal</p>
      </div>
      <div className="nav-item">
        <p>Tableau de Bord</p> 
      </div>
      <div className="nav-item">
        <p>Liste de Jeux</p>
      </div>
      <div className="nav-item">
        <p>Liste de Prêts</p>
      </div>
      <div className="nav-item">
        <p>Wishlist</p>
      </div>
    </main>
  );
}
