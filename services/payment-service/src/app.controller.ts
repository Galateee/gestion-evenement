/**
 * Controller principal pour la page d'accueil
 * Affiche la documentation des routes disponibles
 */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
        <div style="font-family: monospace; padding: 20px;">
            <h1 style="color: #4CAF50;">✅ Service Paiements est en marche!</h1>
            <hr>
            <h3>📍 Documentation rapide des routes :</h3>
            
            <ul>
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/payments</b> 
                    <br><small>👉 Récupère tous les paiements</small>
                </li>
                
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/payments/:id</b> 
                    <br><small>👉 Récupère un paiement spécifique par son ID</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/payments/user/:userId</b> 
                    <br><small>👉 Récupère tous les paiements d'un utilisateur</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/payments/ticket/:ticketId</b> 
                    <br><small>👉 Récupère le paiement pour un ticket spécifique</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/payments</b> 
                    <br><small>👉 Crée un nouveau paiement manuellement</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/payments/:id/process</b> 
                    <br><small>👉 Traite un paiement (simule Stripe)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/payments/:id/refund</b> 
                    <br><small>👉 Rembourse un paiement confirmé</small>
                </li>
            </ul>

            <hr>
            <h3>🔔 Événements RabbitMQ :</h3>
            <ul>
                <li><b>Consomme:</b> ticket.booked (déclenche création paiement)</li>
                <li><b>Publie:</b> payment.initiated, payment.processed, payment.failed, payment.refunded</li>
            </ul>
        </div>
        `;
  }
}
