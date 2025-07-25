# 🛡️ CF Bypass Cache

> Copy-paste friendly Cloudflare cache bypass rules for WordPress, Laravel, ASP.NET, and generic web applications.

## Overview

CF Bypass Cache provides a comprehensive collection of ready-to-use Cloudflare cache bypass rules designed to ensure dynamic content is always served fresh. These rules help you maintain optimal performance while ensuring critical dynamic content (admin areas, user sessions, comments) bypasses the cache when necessary.

## 🎯 Key Features

- **🚀 Ready-to-Use**: Copy-paste friendly rule sets
- **🎨 Framework-Specific**: Optimized for popular platforms
- **📝 Well-Documented**: Clear instructions and examples
- **🔧 Customizable**: Easy to modify for specific needs
- **⚡ Performance-Focused**: Minimal impact on cache hit rates

## 📦 Available Rule Sets

### 🎯 All-in-One Rules
**Universal cache bypass rules for comprehensive coverage**

A complete set of cache bypass rules that covers most common scenarios across different platforms.

```cloudflare
# All-in-One Cache Bypass Rules
(http.request.uri wildcard "/wp-admin*")
or (http.request.uri contains "/admin")
or (http.request.uri contains "/umbraco")
or (http.cookie contains "wordpress_logged_in")
or (http.cookie contains "wordpress_sec")
or (http.cookie contains "wp_postpass")
or (http.cookie contains "wp-")
or (http.cookie contains "wordpress")
or (http.cookie contains "comment_")
or (http.cookie contains "laravel_session")
or (http.cookie contains "XSRF-TOKEN")
or (http.cookie contains "remember_web_")
or (http.cookie contains "ASP.NET_SessionId")
or (http.cookie contains ".ASPXAUTH")
or (http.cookie contains ".AspNetCore.")
or (http.cookie contains "__RequestVerificationToken")
or (http.cookie contains "PHPSESSID")
or (http.cookie contains "session")
or (http.cookie contains "auth")
or (http.cookie contains "token")
or (http.cookie contains "user")
```

**Use Cases:**
- Multi-platform websites
- Quick universal setup
- Basic protection needs

[📖 Full Documentation](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/all-in-one-bypass-cache.rules.md) | [📋 Copy Rules](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/all-in-one-bypass-cache.rules)

### 🌐 General Web Applications
**Universal rules for most web applications**

Comprehensive cache bypass rules that work with most web frameworks and content management systems.

```cloudflare
# General Cache Bypass Rules
(http.request.uri.path contains "/admin" or
 http.request.uri.path contains "/dashboard" or
 http.request.uri.path contains "/login" or
 http.request.uri.path contains "/logout" or
 http.request.uri.path contains "/register" or
 http.request.uri.path contains "/profile" or
 http.request.uri.path contains "/account" or
 http.request.uri.query contains "nocache" or
 http.request.uri.query contains "preview" or
 http.cookie contains "session" or
 http.cookie contains "auth" or
 http.cookie contains "login")
```

**Features:**
- Generic admin area protection
- Session-based bypassing
- Query parameter triggers
- Cookie-based detection

[📖 Full Documentation](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/general-bypass-cache.rules.md) | [📋 Copy Rules](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/general-bypass-cache.rules)

### 📝 WordPress Specific
**Highly optimized rules for WordPress sites**

Specialized cache bypass rules designed specifically for WordPress, covering all common scenarios including multisite installations.

```cloudflare
# WordPress Cache Bypass Rules
(http.request.uri.path contains "/wp-admin" or
 http.request.uri.path contains "/wp-login.php" or
 http.request.uri.path contains "/wp-cron.php" or
 http.request.uri.path contains "/xmlrpc.php" or
 http.request.uri.path contains "/wp-json" or
 http.request.uri.query contains "preview=true" or
 http.request.uri.query contains "customize_changeset_uuid" or
 http.cookie contains "wordpress_logged_in" or
 http.cookie contains "wp-postpass" or
 http.cookie contains "comment_author")
```

**WordPress Features:**
- Admin dashboard protection
- Preview functionality
- Customizer support
- Comment system handling
- Password-protected posts
- XML-RPC protection
- REST API considerations

[📖 Full Documentation](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/wordpress.rules.md) | [📋 Copy Rules](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/cf-bypass-cache/wordpress.rules)

## 🚀 Quick Start

### Step 1: Choose Your Rule Set
Select the appropriate rule set based on your platform:
- **WordPress sites**: Use WordPress-specific rules
- **General web apps**: Use general application rules  
- **Mixed environments**: Use all-in-one rules

### Step 2: Access Cloudflare Dashboard
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Navigate to **Rules** → **Cache Rules**

### Step 3: Create New Rule
1. Click **"Create rule"**
2. Give your rule a descriptive name (e.g., "Bypass Cache for Dynamic Content")
3. Select **"Custom filter expression"**

### Step 4: Add Expression
1. Copy the desired rule from our documentation
2. Paste it into the expression builder
3. Set the action to **"Bypass cache"**

### Step 5: Test & Deploy
1. Test the rule with a few URLs
2. Save and deploy the rule
3. Monitor cache hit rates to ensure proper functionality

## 🛠️ Configuration Guide

### Cache Rule Priority
Ensure your bypass rules have higher priority than general caching rules:

```
Priority 1: Bypass Cache Rules (Dynamic Content)
Priority 2: Cache Everything Rules (Static Content)
Priority 3: Default Cloudflare Behavior
```

### Common Customizations

#### Add Custom Paths
```cloudflare
# Add your custom admin path
http.request.uri.path contains "/custom-admin" or
```

#### Exclude Specific File Types
```cloudflare
# Don't bypass cache for images in admin
not (http.request.uri.path contains "/wp-admin" and 
     http.request.uri.path matches ".*\\.(jpg|jpeg|png|gif|webp)$")
```

#### Add Custom Cookies
```cloudflare
# Add your application's session cookie
http.cookie contains "my_app_session" or
```

## 📊 Performance Impact

### Before Implementation
- **Dynamic Content**: Cached incorrectly
- **User Experience**: Stale admin pages, login issues
- **Security**: Potential cache poisoning risks

### After Implementation
- **Cache Hit Rate**: Optimal (90%+ for static content)
- **Dynamic Content**: Always fresh
- **User Experience**: Seamless admin/user interactions
- **Security**: Protected against cache-based attacks

### Performance Metrics
| Metric | Improvement |
|--------|------------|
| Admin Load Time | ✅ Consistent |
| User Session Handling | ✅ Reliable |
| Cache Hit Rate | ✅ Maintained |
| Security Posture | ✅ Enhanced |

## 🔧 Advanced Configuration

### Multiple Environment Setup
For staging and production environments:

```cloudflare
# Environment-specific bypassing
(http.host eq "staging.example.com" and http.request.uri.path contains "/admin") or
(http.host eq "example.com" and http.request.uri.path contains "/wp-admin")
```

### Geographic Bypassing
Bypass cache for specific regions:

```cloudflare
# Bypass for specific countries
(ip.geoip.country in {"US" "CA"} and http.request.uri.path contains "/admin")
```

### Time-based Rules
Bypass cache during specific hours:

```cloudflare
# Bypass during maintenance windows
(http.request.timestamp.hour ge 2 and http.request.timestamp.hour le 4)
```

## ⚠️ Best Practices

### Do's ✅
- **Test thoroughly** before deploying to production
- **Monitor cache hit rates** after implementation
- **Use specific paths** rather than broad wildcards
- **Document custom modifications** for your team
- **Review rules periodically** for optimization

### Don'ts ❌
- **Don't bypass cache for static assets** (CSS, JS, images)
- **Don't use overly broad rules** that hurt performance
- **Don't forget to test user flows** after implementation
- **Don't modify rules during high traffic** periods
- **Don't bypass cache for public API endpoints** unless necessary

## 🐛 Troubleshooting

### Common Issues

#### Rule Not Working
**Symptoms**: Dynamic content still being cached
**Solutions**:
1. Check rule priority order
2. Verify expression syntax
3. Test with cache purge
4. Check for conflicting rules

#### Too Many Cache Misses
**Symptoms**: Decreased cache hit rate
**Solutions**:
1. Review rule specificity
2. Remove overly broad patterns
3. Use more targeted cookie checks
4. Monitor with Cloudflare Analytics

#### Admin Area Issues
**Symptoms**: Admin pages showing cached content
**Solutions**:
1. Clear browser cache
2. Check cookie-based rules
3. Verify admin path patterns
4. Test in incognito mode

### Debug Mode
Enable debug mode to see rule matching:

```cloudflare
# Add debug header to see rule processing
http.request.headers["cf-debug-bypass"][0] eq "true"
```

## 📈 Monitoring & Analytics

### Key Metrics to Track
- **Cache Hit Rate**: Should remain high (85%+)
- **Origin Response Time**: Should be consistent
- **Error Rate**: Should not increase
- **User Session Issues**: Should decrease

### Cloudflare Analytics
Monitor these dashboard sections:
1. **Caching** → **Cache Performance**
2. **Rules** → **Cache Rules Analytics**
3. **Security** → **Security Events**

## 🔄 Migration Guide

### From Page Rules to Cache Rules
Legacy Page Rules users should migrate to the new Cache Rules:

```cloudflare
# Old Page Rule (deprecated)
example.com/wp-admin/*

# New Cache Rule (recommended)
http.request.uri.path contains "/wp-admin"
```

### Benefits of Migration:
- Better performance
- More flexible expressions
- Improved analytics
- Modern rule engine

## 📚 Additional Resources

### Cloudflare Documentation
- [Cache Rules Documentation](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Rules Language Reference](https://developers.cloudflare.com/ruleset-engine/rules-language/)
- [Expression Builder](https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/)

### Community Resources
- [Cloudflare Community](https://community.cloudflare.com/)
- [WordPress Performance Guide](https://wordpress.org/support/article/optimization/)
- [Web Performance Best Practices](https://web.dev/performance/)

## 🤝 Contributing

Help us improve these cache rules:

1. **Test rules** with your setup
2. **Report issues** with specific configurations  
3. **Suggest improvements** for better compatibility
4. **Share your custom rules** that others might benefit from

### Contribution Guidelines
- Test rules thoroughly before submitting
- Provide clear documentation for new rules
- Include use cases and examples
- Follow existing formatting conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/LICENSE) file for details.

## ✨ Credits

- **Cloudflare Team** for the amazing platform and documentation
- **Community Contributors** for testing and feedback
- **WordPress Community** for insights into common patterns
- **Web Performance Experts** for optimization guidance
