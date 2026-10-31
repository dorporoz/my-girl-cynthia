import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../config';
export default function MissMeButton() {
  return (
    <a className="missme" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={20} aria-hidden /> Miss Me?
    </a>
  );
}
