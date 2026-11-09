import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',timeout:45000,globalTimeout:180000,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:800},trace:'retain-on-failure'},
 webServer:{command:'python3 tools/serve.py',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
});
