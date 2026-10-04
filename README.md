# JjTech's PS4 Dashboard

Un tableau de bord web personnalisé et premium pour lancer l'exploit PSFree + Lapse sur PlayStation 4 (Firmware 9.00).

## Fonctionnalités

- **Interface Premium** : Design aux couleurs PlayStation (vagues lumineuses, thèmes sombres, flou).
- **Navigation Manette** : Entièrement navigable avec la manette DualShock 4 via l'API Gamepad (Croix pour valider, L1/R1 pour naviguer).
- **Exploit Intégré** : Intègre directement la chaîne d'exploit PSFree (WebKit) et Lapse (Kernel).
- **Console Interactive** : Panneau d'exécution affichant les logs et l'état de l'exploit en temps réel.
- **Support Hors-Ligne** : Service Worker inclus pour la mise en cache (PWA). Une fois la page visitée, l'exploit est stocké dans le navigateur de la PS4 de façon permanente.

## Installation & Utilisation

1. Déployez le contenu de ce dossier sur n'importe quel serveur web (GitHub Pages, serveur local Python, Node.js, etc.).
2. Sur la PS4, allez dans le navigateur web et entrez l'URL de la page.
3. Le tableau de bord s'affiche. Choisissez **GoldHEN v2.4** ou cliquez sur **Lancer le Jailbreak**.
4. Patientez pendant l'exécution (la console de logs affichera les étapes).
5. Une fois terminé, la notification de réussite apparaîtra. 

## Test en local

Si vous voulez tester l'interface sur votre ordinateur :

```bash
# Lancer un serveur web local (Python)
python3 -m http.server 8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur.

## Crédits

- **Interface & Personnalisation** : JjTech's
- **Exploit PSFree** : anonymous
- **Lapse Kernel Exploit** : anonymous
*L'exploit est sous licence AGPL v3.*
