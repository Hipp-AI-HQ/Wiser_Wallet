# Deployment Guide - Bilt Card Points Calculator

## Quick Start

The calculator is ready to use! It's a static HTML/CSS/JavaScript application with no backend requirements.

### Test Locally
1. Open `/Users/dillonhippensteel/Wiser_Wallet/index.html` in your web browser
2. The calculator should load with default values ($2,000 rent, $1,000 spending, Blue card)
3. Adjust the sliders to see real-time point calculations

## Deployment Options

Choose any of these options to deploy your calculator online:

### Option 1: Netlify (Recommended - Easiest)

1. **Sign up** at [netlify.com](https://www.netlify.com)
2. **Drag and drop**:
   - Open Netlify
   - Drag the `/Wiser_Wallet` folder to the Netlify drop zone
   - Your site will deploy instantly
3. **Get a URL**: Netlify provides a free URL (e.g., `https://bilt-calculator.netlify.app`)

**Pros**: Instant, free, no configuration needed
**Cons**: URL is less custom (unless you upgrade)

### Option 2: GitHub Pages (Free)

1. **Create a GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Create repo named `Wiser_Wallet` (or any name)
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Bilt calculator"
     git remote add origin https://github.com/YOUR_USERNAME/Wiser_Wallet.git
     git push -u origin main
     ```

2. **Enable GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or `main` if that's your default)
   - Click Save

3. **Access your site**: `https://YOUR_USERNAME.github.io/Wiser_Wallet/`

**Pros**: Free, custom domain options, integrated with GitHub
**Cons**: Requires Git knowledge

### Option 3: Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Connect your GitHub repository**:
   - Click "Import Project"
   - Select your GitHub repo
   - Vercel auto-detects it's a static site
3. **Deploy**: Click "Deploy"
4. **Get a URL**: `https://bilt-calculator.vercel.app` (customizable)

**Pros**: Fast, great performance, free tier
**Cons**: Requires GitHub connection

### Option 4: AWS S3 + CloudFront

For enterprise/production deployments:

1. Create S3 bucket
2. Enable static website hosting
3. Upload all files
4. Use CloudFront for CDN
5. Configure custom domain with Route 53

[AWS S3 Static Website Hosting Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## Custom Domain Setup

After deploying to any service, you can add a custom domain:

### Using a custom domain (e.g., `bilt-calculator.wiserworkallet.com`)

1. **Register domain** at [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com), or similar
2. **Add domain to your hosting**:
   - **Netlify**: Settings → Domain management → Add custom domain
   - **Vercel**: Settings → Domains → Add custom domain
   - **GitHub Pages**: Settings → Pages → Custom domain
3. **Update DNS records** with your registrar (each platform provides instructions)
4. **Wait 24-48 hours** for DNS propagation

## File Structure for Deployment

Ensure this structure is deployed:

```
/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── calculator.css
│   │   ├── results.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── config.js
│   │   ├── calculator.js
│   │   ├── ui.js
│   │   └── main.js
│   └── images/
│       └── logo.png
```

## Performance Optimization

The calculator is already optimized, but here are additional tips:

1. **Enable GZIP compression** on your hosting (most providers do this automatically)
2. **Enable browser caching** (cache files for 30 days)
3. **Minify CSS/JS** (optional, minimal performance gain for this project)
4. **Monitor performance** with Google PageSpeed Insights

## Testing After Deployment

After deploying, test these scenarios:

1. **Load Time**: Page should load in under 2 seconds
2. **Mobile Responsiveness**: Test on iPhone and Android
3. **Calculations**: Verify with test cases:
   - High spender ($3,000 rent, $4,000 spend, Blue card)
   - Low spender ($2,000 rent, $300 spend, Palladium card)
   - Default values ($2,000 rent, $1,000 spend, Blue card)
4. **Browser Compatibility**: Test in Chrome, Safari, Firefox, Edge
5. **Slider Responsiveness**: Drag sliders and verify real-time updates
6. **Card Selection**: Test all three cards
7. **Obsidian Category**: Verify toggle works

## Analytics (Optional)

To track calculator usage, add Google Analytics:

1. Add this to the `<head>` section of `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. Replace `GA_MEASUREMENT_ID` with your Google Analytics ID

## SSL/HTTPS

All recommended platforms (Netlify, Vercel, GitHub Pages) provide **free SSL certificates** by default. Your site will automatically be HTTPS-enabled.

## Updates and Maintenance

To update the calculator after deployment:

1. **Local Changes**: Edit files locally
2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Update: [description of changes]"
   git push
   ```
3. **Auto-Deploy**: Most platforms auto-deploy on push to main/production branch
4. **Verify**: Check your deployed site after ~1-2 minutes

## Troubleshooting

### Issue: Calculator not calculating
**Solution**: Open browser console (F12) and check for JavaScript errors. Ensure all .js files loaded correctly.

### Issue: Logo not showing
**Solution**: Verify `assets/images/logo.png` exists in deployment. Check file permissions.

### Issue: Styles not applied
**Solution**: Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete). Verify CSS files are loading.

### Issue: Slow performance
**Solution**: Check browser network tab (F12). If files are large, enable compression in hosting settings.

## Support Resources

- **Bilt Rewards**: https://www.bilt.com/card
- **Netlify Docs**: https://docs.netlify.com
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Pages**: https://pages.github.com

## Monitoring

After deployment, monitor:

1. **Uptime**: Most platforms provide automatic monitoring
2. **Error Tracking**: Add Sentry or similar (optional)
3. **Performance**: Use Google PageSpeed Insights
4. **Analytics**: Track user engagement with Google Analytics

---

## Ready to Deploy?

Choose your preferred platform above and follow the steps. The calculator should be live in minutes!

For questions, refer to the README.md or platform-specific documentation.
