import React, { useState, useEffect, useMemo } from 'react';
import { useEditor } from '../context/EditorContext';
import { X, Send, Copy, Check, MessageSquare, Loader2 } from 'lucide-react';
import { SharePayload } from '../types/canvas';

interface ShareDialogProps {
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ onClose }) => {
  const { state } = useEditor();

  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Derive Discord payload with useMemo for optimal performance
  const sharePayload: SharePayload = useMemo(() => ({
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
  }), [state.elements, state.canvasDimensions]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(sharePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDispatchPayload = async () => {
    setIsLoading(true);
    setApiStatus(null);

    // If a Webhook URL is provided, issue actual HTTP POST request with REST error handling
    if (webhookUrl.trim().startsWith('http')) {
      try {
        const res = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sharePayload),
        });

        if (res.ok || res.status === 204) {
          setApiStatus({ type: 'success', message: '✅ Payload successfully dispatched to REST Webhook endpoint!' });
        } else {
          setApiStatus({ type: 'error', message: `⚠️ HTTP Error ${res.status}: ${res.statusText || 'Failed to post payload'}` });
        }
      } catch (err) {
        setApiStatus({ type: 'error', message: '❌ Network failure or CORS blocked request to endpoint.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate REST HTTP endpoint latency & payload delivery
      setTimeout(() => {
        setIsLoading(false);
        setApiStatus({ type: 'success', message: '✅ Layout payload successfully simulated & dispatched to Discord channel!' });
      }, 600);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} style={{ color: '#5865F2' }} />
            <h3 id="share-dialog-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Discord Webhook Share Simulation</h3>
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
          Simulate or dispatch your UGC sandbox layout payload directly to a Discord webhook endpoint via HTTP POST.
        </p>

        {/* Webhook Input */}
        <div className="form-group">
          <label htmlFor="webhook-url-input" className="form-label">Discord Webhook URL (Optional for Simulation)</label>
          <input
            id="webhook-url-input"
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
            onClick={handleDispatchPayload}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
            {isLoading ? 'Dispatching...' : 'Dispatch Payload'}
          </button>

          <button className="btn btn-secondary" onClick={handleCopyPayload}>
            {copied ? <Check size={15} style={{ color: '#34D399' }} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        {apiStatus && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: apiStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: apiStatus.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              color: apiStatus.type === 'success' ? '#34D399' : '#FCA5A5',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {apiStatus.message}
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
