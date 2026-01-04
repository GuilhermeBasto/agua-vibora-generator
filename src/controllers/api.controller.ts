import { Request, Response } from 'express';

/**
 * API info page controller
 */
export const getApiInfo = (req: Request, res: Response): void => {
  res.send(`
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API - Água de Víbora</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            background: #020617;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .bg-gradient {
            position: fixed;
            inset: 0;
            background: linear-gradient(to bottom right, rgba(6, 182, 212, 0.1), rgba(15, 23, 42, 1), rgba(16, 185, 129, 0.1));
            pointer-events: none;
        }
        .container {
            position: relative;
            max-width: 900px;
            width: 100%;
            background: #0f172a;
            border-radius: 16px;
            border: 1px solid #1e293b;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(to right, #0891b2, #059669);
            padding: 48px 40px;
            text-align: center;
        }
        h1 {
            color: white;
            font-size: 2.5em;
            font-weight: 800;
            margin: 0 0 12px 0;
        }
        .version {
            color: rgba(165, 243, 252, 0.9);
            font-size: 1.1em;
            margin: 0;
        }
        .content {
            padding: 40px;
        }
        .description {
            color: #cbd5e1;
            font-size: 1.1em;
            margin-bottom: 40px;
        }
        h2 {
            color: #e2e8f0;
            font-size: 1.5em;
            font-weight: 700;
            margin: 0 0 24px 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875em;
        }
        .endpoint {
            background: rgba(30, 41, 59, 0.5);
            padding: 20px;
            margin-bottom: 16px;
            border-radius: 12px;
            border: 1px solid #1e293b;
            transition: all 0.2s;
        }
        .endpoint:hover {
            border-color: #0891b2;
            transform: translateY(-2px);
        }
        .endpoint code {
            background: linear-gradient(to right, #0891b2, #0e7490);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            font-weight: 600;
            display: inline-block;
        }
        .endpoint-desc {
            color: #94a3b8;
            margin-top: 10px;
            line-height: 1.6;
        }
        .docs-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 32px;
            padding: 14px 28px;
            background: linear-gradient(to right, #0891b2, #059669);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(8, 145, 178, 0.3);
        }
        .docs-link:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 12px rgba(8, 145, 178, 0.4);
        }
        .footer {
            text-align: center;
            padding: 24px;
            border-top: 1px solid #1e293b;
            color: #64748b;
            font-size: 0.875em;
        }
    </style>
</head>
<body>
    <div class="bg-gradient"></div>
    
    <div class="container">
        <div class="header">
            <h1>🌊 Água de Víbora API</h1>
            <p class="version">Versão 1.0.0</p>
        </div>
        
        <div class="content">
            <div class="description">API para gestão de calendários de rega</div>
            
            <h2>Endpoints Disponíveis</h2>
            
            <div class="endpoint">
                <code>GET /api/healthz</code>
                <div class="endpoint-desc">Verifica o estado da API</div>
            </div>
            
            <div class="endpoint">
                <code>GET /api/irrigation/download-full-agenda</code>
                <div class="endpoint-desc">Descarrega calendário completo (xlsx, pdf)</div>
            </div>
            
            <div class="endpoint">
                <code>GET /api/irrigation/download-template</code>
                <div class="endpoint-desc">Descarrega template sem horários (xlsx, pdf)</div>
            </div>
            
            <div class="endpoint">
                <code>GET /api/irrigation/download-calendar</code>
                <div class="endpoint-desc">Descarrega calendário .ics para importar</div>
            </div>
            
            <a href="/api-docs" class="docs-link">
                <span>📖</span>
                <span>Ver Documentação Completa</span>
            </a>
        </div>
        
        <div class="footer">
            © 2026 Aviança da Água de Víbora • Sistema de Gestão de Rega
        </div>
    </div>
</body>
</html>
  `);
};
