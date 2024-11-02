document.addEventListener('click', function(e) {
    for (let i = 0; i < 10; i++) { // Create multiple particles
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${e.pageX}px`;
        particle.style.top = `${e.pageY}px`;
        
        // Set random directions
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100;
        particle.style.setProperty('--translate-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--translate-y', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
});
