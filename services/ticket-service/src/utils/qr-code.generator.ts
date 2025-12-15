/**
 * Utilitaire de génération de QR codes pour les billets
 * Encode les informations du billet pour validation à l'entrée de l'événement
 */
import * as QRCode from 'qrcode';

export interface QRCodeData {
  ticketId: string;
  eventId: string;
  userId: string;
  timestamp: number;
}

export async function generateQRCode(
  ticketId: string,
  eventId: string,
  userId: string,
): Promise<string> {
  const qrData: QRCodeData = {
    ticketId,
    eventId,
    userId,
    timestamp: Date.now(),
  };

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function validateQRCode(qrCodeData: string): QRCodeData | null {
  try {
    const parsed = JSON.parse(qrCodeData);

    if (
      parsed.ticketId &&
      parsed.eventId &&
      parsed.userId &&
      parsed.timestamp
    ) {
      return parsed as QRCodeData;
    }

    return null;
  } catch (error) {
    console.error('Erreur lors du décodage du QR code:', error);
    return null;
  }
}
