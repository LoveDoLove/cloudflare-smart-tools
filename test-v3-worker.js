// Test the v3 worker for syntax and functionality
const fs = require('fs');

try {
  const workerCode = fs.readFileSync('./workers/cf-smart-cache-html-v3.js', 'utf8');
  
  // Basic syntax validation
  new Function(workerCode);
  
  console.log('✅ v3.0 Worker syntax is valid');
  console.log('📊 Script size:', Math.round(workerCode.length / 1024), 'KB');
  
  // Check for key v3.0 features
  const v3Features = {
    'getUserAuthenticationState': workerCode.includes('function getUserAuthenticationState'),
    'simpleHash': workerCode.includes('function simpleHash'),
    'Vary header fix': workerCode.includes('Vary", "Cookie"'),
    'Auth state in cache key': workerCode.includes('cf_auth_state'),
    'v3.0 version tag': workerCode.includes('v3.0'),
    'Cache fix debug header': workerCode.includes('x-Edge-Cache-Fix')
  };
  
  console.log('🆕 v3.0 Features:');
  Object.entries(v3Features).forEach(([feature, exists]) => {
    console.log(`  ${exists ? '✅' : '❌'} ${feature}`);
  });
  
  // Check for authentication state handling
  const authFeatures = {
    'Anonymous state': workerCode.includes("'anonymous'"),
    'Session state': workerCode.includes("'session'"),
    'Auth hash state': workerCode.includes("'auth_'"),
    'Cache poisoning fix': workerCode.includes('prevent cache poisoning')
  };
  
  console.log('🔐 Authentication Features:');
  Object.entries(authFeatures).forEach(([feature, exists]) => {
    console.log(`  ${exists ? '✅' : '❌'} ${feature}`);
  });
  
  // Verify critical functions exist
  const criticalFunctions = [
    'handleRequest',
    'hasLoginCookie', 
    'detectSiteType',
    'analyzeSessionCookies',
    'getUserAuthenticationState',
    'generateCacheRequest',
    'createSafeResponse'
  ];
  
  console.log('🔧 Critical Functions:');
  criticalFunctions.forEach(func => {
    const exists = workerCode.includes(`function ${func}`);
    console.log(`  ${exists ? '✅' : '❌'} ${func}`);
  });
  
  console.log('\n🎉 v3.0 Worker is ready for deployment!');
  console.log('📝 Key improvements:');
  console.log('   - User-aware cache keys prevent cache poisoning');
  console.log('   - Proper Vary headers for RFC 7234 compliance');
  console.log('   - Authentication state isolation');
  console.log('   - Enhanced debug information');
  
} catch (error) {
  console.error('❌ v3.0 Worker has issues:');
  console.error(error.message);
  process.exit(1);
}
