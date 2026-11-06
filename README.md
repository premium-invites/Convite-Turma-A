# Convite Digital — Formatura do ABC | CEPA — Turma A

Este pacote é um site estático preparado para publicação no GitHub Pages.

## O que já está incluído
- `index.html`: abertura e página principal do convite.
- `manual.html`: Manual do Convidado com os dados confirmados.
- `styles.css`, `manual.css`, `app.js`: visual e funcionamento.
- `config.js`: dados e caminhos de mídia desta turma.
- `layout.json`: posições iniciais dos dois botões.
- `assets/opening.mp4`: vídeo de abertura otimizado para H.264.
- `assets/preview.jpg`: capa horizontal 1200 × 630 para compartilhamento.
- `assets/editor-poster.webp`: imagem provisória para visualizar o editor enquanto o vídeo principal não está instalado.

## Mídias que ainda precisam ser adicionadas
Os arquivos abaixo não foram incorporados a este ZIP porque não estavam disponíveis no ambiente de montagem. Coloque-os na pasta `assets/` com estes nomes exatos:

1. **Vídeo principal desta turma:** `turma-a.mp4`
2. **Trilha sonora:** `trilha.wav` (arquivo WAV enviado pelo cliente: “You Are My Spring - Yosep”).

Sem esses dois arquivos, o site abre e permite testar o layout, mas não reproduz a experiência final completa. O vídeo de abertura `opening.mp4` já está incluído.

## Editor visual dos botões
Depois de publicar o site, abra:

`?editor=1`

Exemplo: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/?editor=1`

No editor:
- arraste os botões diretamente sobre a área do vídeo;
- selecione Localização ou Manual do Convidado;
- ajuste X, Y e largura pelos controles;
- use **Salvar neste navegador** para guardar uma prévia local;
- use **Baixar layout.json** para exportar as posições finais.

Para publicar as novas posições, substitua o `layout.json` do repositório pelo arquivo exportado e envie o commit ao GitHub. O editor não grava diretamente no GitHub.

## Publicar no GitHub Pages
1. Extraia o ZIP.
2. Adicione os arquivos de mídia pendentes à pasta `assets/`.
3. Envie todo o conteúdo para a raiz de um repositório GitHub.
4. Abra **Settings → Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Escolha a branch `main` e a pasta `/ (root)`.
7. Salve e aguarde a publicação.

## Prévia do WhatsApp
A imagem `assets/preview.jpg` já tem 1200 × 630 pixels. Depois de saber a URL pública final, atualize `og:image` em `index.html` para a URL absoluta:
`https://SEU-USUARIO.github.io/SEU-REPOSITORIO/assets/preview.jpg`

Faça o mesmo para a descrição/título Open Graph, se desejar. Serviços como WhatsApp podem manter uma prévia em cache.

## Informações confirmadas do evento
- Formatura do ABC — CEPA
- Data: 05/12/2026
- Horário: 18h30
- Local: Mistura Fina Buffet
- Localização: Google Maps (link configurado no convite e no manual)

## Observação sobre o manual
O manual apresenta somente informações confirmadas. Regras de traje, antecedência, fotografias ou uso de celular não foram tratadas como oficiais porque ainda não foram confirmadas pela organização.
