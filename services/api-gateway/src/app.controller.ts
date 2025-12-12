import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getApiDocumentation(): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>API Gateway - Event Platform</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 40px; color: #333; }
          .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          h1 { color: #2c3e50; border-bottom: 2px solid #e7e7e7; padding-bottom: 10px; }
          .status { display: inline-block; padding: 5px 10px; border-radius: 15px; background: #e8f5e9; color: #2e7d32; font-size: 0.8em; font-weight: bold; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
          .card { border: 1px solid #eee; padding: 20px; border-radius: 8px; transition: transform 0.2s; background: #fff; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-color: #3498db; }
          .method { background: #3498db; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-right: 5px; }
          a { text-decoration: none; color: inherit; display: block; }
          h3 { margin-top: 0; color: #34495e; }
          p { color: #7f8c8d; font-size: 0.9em; }
          .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 0.8em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h1>API Gateway</h1>
            <span class="status">● Système Opérationnel</span>
          </div>
          <p>Bienvenue sur la passerelle de la Plateforme de Gestion d'Événements.</p>
          
          <div class="grid">
            <a href="/events" target="_blank" class="card">
              <h3>🎉 Événements</h3>
              <p>Gestion du catalogue, recherche et catégories.</p>
              <small><span class="method">PROXY</span> /events</small>
            </a>

            <a href="/tickets" target="_blank" class="card">
              <h3>🎟️ Billetterie</h3>
              <p>Réservations, stocks et types de billets.</p>
              <small><span class="method">PROXY</span> /tickets</small>
            </a>

            <a href="/payments" target="_blank" class="card">
              <h3>💳 Paiements</h3>
              <p>Transactions, historique et remboursements.</p>
              <small><span class="method">PROXY</span> /payments</small>
            </a>

            <a href="/users" target="_blank" class="card">
              <h3>👤 Utilisateurs</h3>
              <p>Profils, rôles et authentification.</p>
              <small><span class="method">PROXY</span> /users</small>
            </a>

            <a href="/notifications" target="_blank" class="card">
              <h3>🔔 Notifications</h3>
              <p>Emails et alertes (Webhooks).</p>
              <small><span class="method">PROXY</span> /notifications</small>
            </a>
          </div>

          <div class="footer">
            Projet Architecture Logicielle 2025-2026 • API Gateway v1.0
          </div>
        </div>
      </body>
      </html>
    `;
  }
}