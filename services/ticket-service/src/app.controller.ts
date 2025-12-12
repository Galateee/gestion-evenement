import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    // Utilisation des backticks (`) pour écrire du HTML sur plusieurs lignes
    return `
        <div style="font-family: monospace; padding: 20px;">
            <h1 style="color: #4CAF50;">✅ Service Billeterie est en marche!</h1>
            <hr>
            <h3>📍 Documentation rapide des routes :</h3>
            
            <ul>
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/tickets</b> 
                    <br><small>👉 Récupère tous les billets enregistrés</small>
                </li>
                
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/tickets/:id</b> 
                    <br><small>👉 Récupère un billet spécifique par son ID</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/tickets</b> 
                    <br><small>👉 Crée un nouveau billet</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/tickets/:id/confirm-payment</b> 
                    <br><small>👉 Confirme le paiement d'un billet spécifique</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/tickets/:id/cancel</b> 
                    <br><small>👉 Annule un billet spécifique</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #fca130; color: white; padding: 2px 6px; border-radius: 4px;">PATCH</span>
                    <b>/tickets/:id</b> 
                    <br><small>👉 Met à jour un billet existant</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #f93e3e; color: white; padding: 2px 6px; border-radius: 4px;">DELETE</span>
                    <b>/tickets/:id</b> 
                    <br><small>👉 Supprime un billet spécifique</small>
                </li>
            </ul>
        </div>
        `;
  }
}
