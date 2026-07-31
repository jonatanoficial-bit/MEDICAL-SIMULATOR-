# Preparação para APK/AAB — v1.0.0

O projeto está preparado como PWA estática e pode ser encapsulado para Android. Nenhum APK foi compilado ou assinado nesta entrega.

## Opção recomendada: Trusted Web Activity

1. Publique a pasta em HTTPS.
2. Valide o manifesto e o service worker no Chrome.
3. Instale o Bubblewrap e inicialize usando a URL do `manifest.webmanifest`.
4. Defina o application ID, ícones, nome, cores e chave de assinatura da organização.
5. Publique `/.well-known/assetlinks.json` com o fingerprint da chave.
6. Gere e teste o AAB em aparelhos Android antes de enviar ao Google Play.

## Opção alternativa: Capacitor

1. Crie um projeto Android com o conteúdo web desta pasta como `webDir`.
2. Configure a Activity com orientação paisagem.
3. Preserve áreas seguras, áudio e ciclo de vida do WebView.
4. Desative navegação externa não autorizada e aplique política de conteúdo.
5. Gere uma build release assinada e teste atualização, backup e restauração.

Exemplo de orientação no Android Manifest:

```xml
<activity
  android:name=".MainActivity"
  android:screenOrientation="sensorLandscape"
  android:exported="true" />
```

## Checklist de publicação

- Usar HTTPS e política de privacidade pública.
- Substituir qualquer chave de desenvolvimento por credenciais de produção.
- Definir versionCode/versionName e assinar o AAB.
- Testar do Android 9 ao Android atual, em telas pequenas, tablet e recorte/notch.
- Validar instalação, atualização, modo offline, retorno do background e rotação.
- Preparar classificação indicativa e declaração clara de uso educacional.
- Obter revisão clínica e jurídica adequada antes de campanhas que façam alegações médicas.
