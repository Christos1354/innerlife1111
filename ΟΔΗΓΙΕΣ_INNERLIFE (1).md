# 📖 Οδηγίες Διαχείρισης — Innerlife Site

## 🚀 Deploy (Ανέβασμα)
```bash
cd ~/Desktop/BACKUP
netlify deploy --prod --dir=.
```

## ✏️ Άνοιγμα index.html
Κλικ δεξί → Άνοιγμα με → TextEdit (ή Visual Studio Code)
Χρησιμοποίησε ⌘F για αναζήτηση.

## 📝 Αλλαγές Κειμένου

| Πύλη | Αναζήτησε με ⌘F |
|------|----------------|
| Νους & Ειρήνη | MEDITATION_CONTENT |
| Γνώση & Φιλοσοφία | WISDOM_CONTENT |
| Γαλήνη & Σχέσεις | MYSTERY_CONTENT |
| Υγεία & Καθημερινότητα | HEALTH_CONTENT |
| Ελπίδα & Επιστήμη | FAITH_CONTENT |
| Αυτογνωσία (Κουίζ) | QUIZ_QUESTIONS |
| Αυτοεξέλιξη 365 | PATH_30 |

### Μορφή κειμένου:
```javascript
{ type:'text', title:'Τίτλος', body:'Κείμενο...' },
```
⚠️ Χρησιμοποίησε ' (στρογγυλό εισαγωγικό) αντί για ' μέσα στα κείμενα.

### ➕ Προσθήκη: Πριν το ]; πρόσθεσε νέα γραμμή
### ❌ Διαγραφή: Σβήσε ολόκληρη τη γραμμή { ... },

## 🕯️ Πιο Λαμπερή Φλόγα Κεριού
Βρες: drawFlame ή ctx.shadowBlur
```javascript
ctx.shadowBlur = 40;  // ← αύξησε (default: 20)
ctx.shadowColor = 'rgba(255,120,30,0.9)';  // ← πιο έντονο
```

## 📏 Μεγαλύτερο/Μικρότερο Μέγεθος

**Πύλες:** Βρες .arch-btn → max-width: 22% (αύξησε %)
**Τίτλος:** Βρες #ep-title → font-size: 28px
**Κύκλοι:** Βρες .gold-circle-btn → clamp(46px, 12vw, 64px)
**Κείμενο πυλών:** Βρες font-size:15px κοντά στο door-card

## ⏱️ Χρόνοι Animation

**Λέξεις προσευχής (ταχύτητα):**
Βρες: i * 700 → μείωσε για γρηγορότερο (π.χ. 400)

**Κύκλος αναπνοής:**
Βρες: transition:transform 4s → άλλαξε τα 4s

## ❓ Προσθήκη Ερώτησης Αυτογνωσίας
Βρες QUIZ_QUESTIONS, πριν ]; :
```javascript
{ text:'Η ερώτηση', dest:'mystery-relations',
  label:'Γαλήνη & Σχέσεις', color:'#ff8099', emoji:'♡' },
```

Τιμές dest: mystery-relations / wisdom-philosophy /
photos-daily / wisdom2-science / meditation / church

## 🌱 Προσθήκη Ημέρας Αυτοεξέλιξης
Βρες PATH_30, πριν ]; :
```javascript
{ day:366, title:'Τίτλος', text:'Η πρόκληση...' },
```

## 📁 manifest.json & sw.js
- manifest.json: Αλλαγή ονόματος site → "name": "Innerlife"
- sw.js: Αν λείπει δες σφάλμα 404 στην Console. Βεβαιώσου ότι είναι στο BACKUP.
  Για offline λειτουργία: πρέπει να υπάρχει. Αν δεν θες offline, αφαίρεσε τη γραμμή:
  <script>if('serviceWorker' in navigator)...</script>

## 📄 Τι είναι το .netlifyignore
Αρχείο χωρίς επέκταση (αρχίζει με τελεία). Το φτιάχνεις μια φορά στο Terminal:
```bash
cd ~/Desktop/BACKUP
echo ".git" > .netlifyignore
```
Λέει στο Netlify να αγνοεί τον φάκελο .git — έτσι δεν χρειάζεσαι sync script.

## ⚠️ Κανόνες Ασφαλείας
1. Πάντα backup πριν αλλάξεις: αντέγραψε index.html ως index_backup.html
2. Μην αφαιρείς: const, ];, }, function
3. Αν σπάσει: επαναφορά από backup + deploy ξανά
4. Για μεγάλες αλλαγές: ζήτα Claude!

## 🆘 Αν Κάτι Δεν Δουλεύει
Άνοιξε Console: ⌘ + Option + J (Chrome)
Αντέγραψε το κόκκινο μήνυμα και στείλε στην Claude.
