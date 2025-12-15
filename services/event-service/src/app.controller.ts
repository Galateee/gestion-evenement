import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
    @Get()
    getHello(): string {
        return `
        <div style="font-family: monospace; padding: 20px;">
            <h1 style="color: #4CAF50;">✅ Service Evénements est en marche!</h1>
            <hr>
            <h3>📍 Documentation rapide des routes :</h3>
            
            <ul>
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/events</b> 
                    <br><small>👉 Récupère tous les événements (Filtres dispos: search, category, status, startDate...)</small>
                </li>
                
                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/events/upcoming</b> 
                    <br><small>👉 Récupère uniquement les événements à venir (startDate > maintenant)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #61affe; color: white; padding: 2px 6px; border-radius: 4px;">GET</span>
                    <b>/events/:id</b> 
                    <br><small>👉 Récupère un événement spécifique par son ID</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #49cc90; color: white; padding: 2px 6px; border-radius: 4px;">POST</span>
                    <b>/events</b> 
                    <br><small>👉 Crée un nouvel événement (Body: title, description, category, capacity...)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #fca130; color: white; padding: 2px 6px; border-radius: 4px;">PATCH</span>
                    <b>/events/:id</b> 
                    <br><small>👉 Met à jour un événement existant (seulement par son organisateur ou un admin)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #f93e3e; color: white; padding: 2px 6px; border-radius: 4px;">DELETE</span>
                    <b>/events/:id</b> 
                    <br><small>👉 Supprime un événement (seulement par son organisateur ou un admin)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #fca130; color: white; padding: 2px 6px; border-radius: 4px;">PATCH</span>
                    <b>/events/:id/publish</b> 
                    <br><small>👉 Publie un événement (status = PUBLISHED)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #fca130; color: white; padding: 2px 6px; border-radius: 4px;">PATCH</span>
                    <b>/events/:id/cancel</b> 
                    <br><small>👉 Annule un événement (status = CANCELLED)</small>
                </li>

                <li style="margin-bottom: 10px;">
                    <span style="background: #fca130; color: white; padding: 2px 6px; border-radius: 4px;">PATCH</span>
                    <b>/events/:id/complete</b> 
                    <br><small>👉 Marque un événement comme terminé (status = COMPLETED, places restantes = 0)</small>
                </li>
            </ul>
        </div>
        `;
    }
}
