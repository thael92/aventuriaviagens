// Monitor de Performance para Aventúria
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timeToInteractive: 0
        };
        
        this.init();
    }
    
    init() {
        // Monitorar carregamento da página
        window.addEventListener('load', () => {
            this.measurePageLoad();
            this.measureWebVitals();
            this.setupResourceMonitoring();
        });
        
        // Monitorar mudanças de performance
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }
    }
    
    measurePageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            console.log(`⏱️ Tempo de carregamento: ${this.metrics.pageLoadTime}ms`);
        }
    }
    
    measureWebVitals() {
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
            this.metrics.firstContentfulPaint = fcpEntry.startTime;
            console.log(`🎨 First Contentful Paint: ${this.metrics.firstContentfulPaint}ms`);
        }
        
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                console.log(`🖼️ Largest Contentful Paint: ${this.metrics.largestContentfulPaint}ms`);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    setupPerformanceObserver() {
        // Monitorar layout shifts
        const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift += clsValue;
            console.log(`📐 Cumulative Layout Shift: ${this.metrics.cumulativeLayoutShift}`);
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // Monitorar recursos longos
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.warn(`⚠️ Tarefa longa detectada: ${entry.duration}ms`);
                this.optimizeLongTask(entry);
            }
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
    
    setupResourceMonitoring() {
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;
        let slowResources = [];
        
        resources.forEach(resource => {
            const duration = resource.responseEnd - resource.requestStart;
            totalSize += resource.transferSize || 0;
            
            if (duration > 1000) { // Recursos que demoram mais de 1s
                slowResources.push({
                    name: resource.name,
                    duration: duration,
                    size: resource.transferSize
                });
            }
        });
        
        console.log(`📊 Total de recursos carregados: ${resources.length}`);
        console.log(`💾 Tamanho total transferido: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        
        if (slowResources.length > 0) {
            console.warn('🐌 Recursos lentos detectados:', slowResources);
            this.optimizeSlowResources(slowResources);
        }
    }
    
    optimizeLongTask(entry) {
        // Quebrar tarefas longas em chunks menores
        if (entry.duration > 50) {
            console.log('🔧 Otimizando tarefa longa...');
            // Implementar estratégias de otimização
            this.scheduleWork();
        }
    }
    
    optimizeSlowResources(resources) {
        resources.forEach(resource => {
            if (resource.name.includes('.jpg') || resource.name.includes('.png')) {
                console.log(`🖼️ Considere otimizar imagem: ${resource.name}`);
            }
            
            if (resource.name.includes('.js') && resource.size > 100000) {
                console.log(`📦 Considere dividir JavaScript: ${resource.name}`);
            }
        });
    }
    
    scheduleWork() {
        // Usar requestIdleCallback para agendar trabalho
        if ('requestIdleCallback' in window) {
            requestIdleCallback((deadline) => {
                while (deadline.timeRemaining() > 0) {
                    // Executar trabalho em pequenos chunks
                    this.doWork();
                }
            });
        } else {
            // Fallback para setTimeout
            setTimeout(() => this.doWork(), 0);
        }
    }
    
    doWork() {
        // Placeholder para trabalho otimizado
        console.log('⚡ Executando trabalho otimizado...');
    }
    
    // Método para obter métricas
    getMetrics() {
        return { ...this.metrics };
    }
    
    // Método para reportar métricas (para analytics)
    reportMetrics() {
        const metrics = this.getMetrics();
        
        // Enviar para Google Analytics, se disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                event_category: 'Performance',
                value: Math.round(metrics.pageLoadTime)
            });
            
            gtag('event', 'first_contentful_paint', {
                event_category: 'Performance',
                value: Math.round(metrics.firstContentfulPaint)
            });
        }
        
        // Log local para desenvolvimento
        console.table(metrics);
    }
}

// Detector de conexão lenta
class ConnectionMonitor {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }
    
    init() {
        if (this.connection) {
            this.checkConnection();
            this.connection.addEventListener('change', () => this.checkConnection());
        }
        
        // Fallback: medir velocidade de download
        this.measureConnectionSpeed();
    }
    
    checkConnection() {
        const { effectiveType, downlink, rtt } = this.connection;
        
        console.log(`📶 Tipo de conexão: ${effectiveType}`);
        console.log(`⬇️ Velocidade de download: ${downlink}Mbps`);
        console.log(`🔄 RTT: ${rtt}ms`);
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            document.body.classList.add('connection-slow');
            this.enableSlowConnectionMode();
        } else {
            document.body.classList.remove('connection-slow');
            this.disableSlowConnectionMode();
        }
    }
    
    measureConnectionSpeed() {
        const startTime = performance.now();
        const image = new Image();
        
        image.onload = () => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            const bitsLoaded = 50000 * 8; // Imagem de ~50KB
            const speedBps = bitsLoaded / (duration / 1000);
            const speedKbps = speedBps / 1024;
            
            console.log(`📊 Velocidade estimada: ${speedKbps.toFixed(2)}Kbps`);
            
            if (speedKbps < 500) { // Menos de 500Kbps
                document.body.classList.add('connection-slow');
                this.enableSlowConnectionMode();
            }
        };
        
        image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A';
    }
    
    enableSlowConnectionMode() {
        console.log('🐌 Modo conexão lenta ativado');
        
        // Desabilitar vídeos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.style.display = 'none';
        });
        
        // Reduzir qualidade de imagens
        const images = document.querySelectorAll('img[data-src-low]');
        images.forEach(img => {
            if (img.dataset.srcLow) {
                img.src = img.dataset.srcLow;
            }
        });
        
        // Desabilitar animações pesadas
        document.documentElement.style.setProperty('--transition-smooth', 'none');
    }
    
    disableSlowConnectionMode() {
        console.log('⚡ Modo conexão normal ativado');
        
        // Reabilitar vídeos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.style.display = '';
            if (video.dataset.autoplay) {
                video.play();
            }
        });
        
        // Restaurar qualidade de imagens
        const images = document.querySelectorAll('img[data-src-high]');
        images.forEach(img => {
            if (img.dataset.srcHigh) {
                img.src = img.dataset.srcHigh;
            }
        });
        
        // Reabilitar animações
        document.documentElement.style.setProperty('--transition-smooth', 'all 0.3s ease');
    }
}

// Otimizador de imagens lazy loading
class ImageOptimizer {
    constructor() {
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        } else {
            this.loadAllImages();
        }
    }
        setupLazyLoading() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observar todas as imagens com data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.imageObserver.observe(img));
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // Criar nova imagem para pré-carregamento
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('loading');
        };
        
        imageLoader.onerror = () => {
            img.classList.add('error');
            img.classList.remove('loading');
            console.error(`Erro ao carregar imagem: ${src}`);
        };
        
        img.classList.add('loading');
        imageLoader.src = src;
    }
    
    loadAllImages() {
        // Fallback para navegadores sem IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }
    
    // Otimizar formato de imagem baseado no suporte do navegador
    optimizeImageFormat(img) {
        const supportsWebP = this.supportsWebP();
        const supportsAVIF = this.supportsAVIF();
        
        if (supportsAVIF && img.dataset.srcAvif) {
            return img.dataset.srcAvif;
        } else if (supportsWebP && img.dataset.srcWebp) {
            return img.dataset.srcWebp;
        } else {
            return img.dataset.src;
        }
    }
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    supportsAVIF() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    }
}

// Gerenciador de cache inteligente
class CacheManager {
    constructor() {
        this.cacheName = 'aventuria-cache-v1';
        this.init();
    }
    
    async init() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registrado:', registration);
            } catch (error) {
                console.error('❌ Erro ao registrar Service Worker:', error);
            }
        }
        
        if ('caches' in window) {
            this.setupCache();
        }
    }
    
    async setupCache() {
        try {
            const cache = await caches.open(this.cacheName);
            
            // Recursos críticos para cache
            const criticalResources = [
                '/',
                '/css/style.css',
                '/js/script.js',
                '/img/logo.png',
                '/img/favicon.ico'
            ];
            
            await cache.addAll(criticalResources);
            console.log('💾 Cache inicial configurado');
        } catch (error) {
            console.error('❌ Erro ao configurar cache:', error);
        }
    }
    
    async cacheResource(url) {
        try {
            const cache = await caches.open(this.cacheName);
            await cache.add(url);
            console.log(`💾 Recurso cacheado: ${url}`);
        } catch (error) {
            console.error(`❌ Erro ao cachear ${url}:`, error);
        }
    }
    
    async getCachedResource(url) {
        try {
            const cache = await caches.open(this.cacheName);
            const response = await cache.match(url);
            return response;
        } catch (error) {
            console.error(`❌ Erro ao buscar cache para ${url}:`, error);
            return null;
        }
    }
}

// Detector de recursos do dispositivo
class DeviceCapabilities {
    constructor() {
        this.capabilities = {
            memory: this.getMemoryInfo(),
            cores: this.getCoreCount(),
            connection: this.getConnectionInfo(),
            battery: null,
            gpu: this.getGPUInfo()
        };
        
        this.init();
    }
    
    async init() {
        // Obter informações da bateria
        if ('getBattery' in navigator) {
            try {
                this.capabilities.battery = await navigator.getBattery();
            } catch (error) {
                console.log('ℹ️ Informações de bateria não disponíveis');
            }
        }
        
        this.adaptInterface();
    }
    
    getMemoryInfo() {
        if ('memory' in performance) {
            return {
                total: performance.memory.totalJSHeapSize,
                used: performance.memory.usedJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
    
    getCoreCount() {
        return navigator.hardwareConcurrency || 4;
    }
    
    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }
    
    getGPUInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                };
            }
        }
        return null;
    }
    
    adaptInterface() {
        const { memory, cores, connection, battery } = this.capabilities;
        
        // Adaptar baseado na memória disponível
        if (memory && memory.total < 1000000000) { // Menos de 1GB
            document.body.classList.add('low-memory');
            this.enableLowMemoryMode();
        }
        
        // Adaptar baseado no número de cores
        if (cores <= 2) {
            document.body.classList.add('low-performance');
            this.enableLowPerformanceMode();
        }
        
        // Adaptar baseado na conexão
        if (connection && connection.saveData) {
            document.body.classList.add('save-data');
            this.enableDataSaverMode();
        }
        
        // Adaptar baseado na bateria
        if (battery && battery.level < 0.2) {
            document.body.classList.add('low-battery');
            this.enableBatterySaverMode();
        }
    }
    
    enableLowMemoryMode() {
        console.log('🧠 Modo baixa memória ativado');
        
        // Reduzir cache de imagens
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
        
        // Limitar animações
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
    
    enableLowPerformanceMode() {
        console.log('⚡ Modo baixa performance ativado');
        
        // Desabilitar efeitos pesados
        const heavyElements = document.querySelectorAll('.parallax-background, .abstract-travel-element');
        heavyElements.forEach(el => el.style.display = 'none');
        
        // Simplificar animações
        document.body.classList.add('reduced-motion');
    }
    
    enableDataSaverMode() {
        console.log('💾 Modo economia de dados ativado');
        
        // Carregar imagens de menor qualidade
        const images = document.querySelectorAll('img[data-src-low]');
        images.forEach(img => {
            if (img.dataset.srcLow) {
                img.dataset.src = img.dataset.srcLow;
            }
        });
        
        // Pausar vídeos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }
    
    enableBatterySaverMode() {
        console.log('🔋 Modo economia de bateria ativado');
        
        // Reduzir frequência de animações
        document.documentElement.style.setProperty('--animation-duration', '1s');
        
        // Desabilitar efeitos visuais pesados
        const effects = document.querySelectorAll('.animate-float, .animate-pulse');
        effects.forEach(el => el.style.animationPlayState = 'paused');
    }
    
    getCapabilities() {
        return { ...this.capabilities };
    }
}

// Inicialização dos monitores
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar monitores apenas em produção ou quando necessário
    if (window.location.hostname !== 'localhost') {
        new PerformanceMonitor();
        new ConnectionMonitor();
        new ImageOptimizer();
        new CacheManager();
        new DeviceCapabilities();
    }
    
    // Log de inicialização
    console.log('🚀 Aventúria - Sistema de monitoramento inicializado');
    console.log('📊 Para ver métricas detalhadas, abra as ferramentas de desenvolvedor');
});

// Exportar classes para uso global
window.AventuriaPerformance = {
    PerformanceMonitor,
    ConnectionMonitor,
    ImageOptimizer,
    CacheManager,
    DeviceCapabilities
};
