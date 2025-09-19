 // Elementos
 const toggleBtn = document.querySelector('.toggle-btn');
 const sidebar = document.getElementById('sidebar');
 const body = document.body;

 // Função para abrir e fechar o menu
 function toggleMenu() {
   sidebar.classList.toggle('active');
   overlay.classList.toggle('active');
   body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
 }

 // Evento no botão
 toggleBtn.addEventListener('click', function(e) {
   e.stopPropagation();
   toggleMenu();
 });

 // Evento no overlay para fechar o menu
 overlay.addEventListener('click', function() {
   toggleMenu();
 });

 // Fechar o menu quando clicar em um link da sidebar
 const sidebarLinks = document.querySelectorAll('.sidebar a');
 sidebarLinks.forEach(link => {
   link.addEventListener('click', toggleMenu);
 });

 // Fechar o menu se a janela for redimensionada para um tamanho maior que mobile
 window.addEventListener('resize', function() {
   if (window.innerWidth > 767) {
     sidebar.classList.remove('active');
     overlay.classList.remove('active');
     body.style.overflow = '';
   }
 });

// JavaScript mínimo para controlar o menu hamburger
 document.addEventListener('DOMContentLoaded', function() {
   const toggleBtn = document.getElementById('toggleBtn');
   const sidebar = document.getElementById('sidebar');
   const overlay = document.getElementById('overlay');

   toggleBtn.addEventListener('click', function() {
     sidebar.classList.toggle('active');
     overlay.classList.toggle('active');
   });

   overlay.addEventListener('click', function() {
     sidebar.classList.remove('active');
     overlay.classList.remove('active');
   });

   // Fechar menu ao clicar em um link (em dispositivos móveis)
   if (window.innerWidth <= 768) {
     const menuLinks = document.querySelectorAll('.sidebar a');
     menuLinks.forEach(link => {
       link.addEventListener('click', function() {
         sidebar.classList.remove('active');
         overlay.classList.remove('active');
       });
     });
   }
 });
