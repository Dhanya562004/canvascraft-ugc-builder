import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { X, Send, Copy, Check, MessageSquare } from 'lucide-react';
import { SharePayload } from '../types/canvas';

interface ShareDialogProps {
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ onClose }) => {
  const { state } = useEditor();

  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  // Generate simulated Discord payload
  const sharePayload: SharePayload = {
    content: '🎨 **New CanvasCraft UGC Layout Shared!**',
    embeds: [
      {
        title: 'CanvasCraft Sandbox Layout Payload',
        description: `Interactive Sandbox design containing ${state.elements.length} elements.`,
        color: 0x6366f1,
        fields: [
          {
            name: 'Dimensions',
            value: `${state.canvasDimensions.width} x ${state.canvasDimensions.height} px`,
            inline: true,
          },
          {
            name: 'Element Breakdown',
            value: state.elements.map((e) => `• ${e.type.toUpperCase()}: "${e.text}"`).join('\n') || 'None',
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
    raw_layout: state.elements,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(sharePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulateDispatch = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} style={{ color: '#5865F2' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Discord Webhook Share Simulation</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '4px 8px' }}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px' }}>
          Simulate sharing your UGC sandbox layout payload directly to a Discord webhook channel.
        </p>

        {/* Webhook Input */}
        <div className="form-group">
          <label className="form-label">Discord Webhook URL (Optional for Simulation)</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://discord.com/api/webhooks/12345/abcde..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, background: '#5865F2' }}
            onClick={handleSimulateDispatch}
          >
            <Send size={15} />
            Dispatch Payload
          </button>

          <button className="btn btn-secondary" onClick={handleCopyPayload}>
            {copied ? <Check size={15} style={{ color: '#34D399' }} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        {dispatched && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            ✅ Layout payload successfully simulated &amp; dispatched to Discord channel!
          </div>
        )}

        {/* Discord Card Preview Simulation */}
        <div className="card" style={{ background: '#2F3136', borderColor: '#202225' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B9BBBE', marginBottom: '8px' }}>
            SIMULATED DISCORD EMBED PREVIEW
          </div>

          <div
            style={{
              borderLeft: '4px solid #5865F2',
              background: '#2F3136',
              padding: '12px',
              borderRadius: '4px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '4px' }}>
              {sharePayload.embeds[0].title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#DDC1D5', marginBottom: '8px' }}>
              {sharePayload.embeds[0].description}
            </div>

            {sharePayload.embeds[0].fields.map((f, i) => (
              <div key={i} style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B9BBBE' }}>{f.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#FFFFFF', whiteSpace: 'pre-line' }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
