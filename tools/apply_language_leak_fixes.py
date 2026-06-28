from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANGS = ["pl", "de", "es", "fr"]

FIXES = {
    "ProjecTile is being built to help structure complex engineering work, connecting requirements, documents, calculations, reports, and decisions in one focused workspace.": {
        "pl": "ProjecTile powstaje, aby porzadkowac zlozona prace inzynierska, laczac wymagania, dokumenty, obliczenia, raporty i decyzje w jednym skupionym workspace.",
        "de": "ProjecTile wird entwickelt, um komplexe Engineering-Arbeit zu strukturieren und Anforderungen, Dokumente, Berechnungen, Berichte und Entscheidungen in einem fokussierten Workspace zu verbinden.",
        "es": "ProjecTile se esta construyendo para estructurar trabajo de ingenieria complejo, conectando requisitos, documentos, calculos, informes y decisiones en un workspace enfocado.",
        "fr": "ProjecTile est construit pour structurer le travail d’ingenierie complexe en reliant exigences, documents, calculs, rapports et decisions dans un workspace concentre.",
    },
    "From scattered files to project intelligence.": {
        "pl": "Od rozproszonych plikow do inteligencji projektowej.",
        "de": "Von verstreuten Dateien zu Projektintelligenz.",
        "es": "De archivos dispersos a inteligencia de proyecto.",
        "fr": "Des fichiers disperses a l’intelligence projet.",
    },
    "Future engineering specialists will support technical conversations across electrical, automation, mechanical, robotics, software, safety, and project domains.": {
        "pl": "Przyszli specjalisci inzynierscy beda wspierac rozmowy techniczne w obszarach elektryki, automatyki, mechaniki, robotyki, software, bezpieczenstwa i projektow.",
        "de": "Zukuenftige Engineering-Spezialisten unterstuetzen technische Gespraeche ueber Elektrotechnik, Automation, Mechanik, Robotik, Software, Sicherheit und Projektbereiche hinweg.",
        "es": "Los futuros especialistas de ingenieria apoyaran conversaciones tecnicas en electricidad, automatizacion, mecanica, robotica, software, seguridad y proyectos.",
        "fr": "Les futurs specialistes d’ingenierie soutiendront les echanges techniques en electricite, automatisation, mecanique, robotique, software, securite et domaines projet.",
    },
    "Ask better questions. Build better answers.": {
        "pl": "Zadawaj lepsze pytania. Buduj lepsze odpowiedzi.",
        "de": "Bessere Fragen stellen. Bessere Antworten bauen.",
        "es": "Hacer mejores preguntas. Construir mejores respuestas.",
        "fr": "Poser de meilleures questions. Construire de meilleures reponses.",
    },
    "Designed to help surface assumptions, missing information, risks, safety concerns, and decision points before they become costly project problems.": {
        "pl": "Zaprojektowane, aby ujawniac zalozenia, brakujace informacje, ryzyka, kwestie bezpieczenstwa i punkty decyzyjne, zanim stana sie kosztownymi problemami projektu.",
        "de": "Entwickelt, um Annahmen, fehlende Informationen, Risiken, Sicherheitsfragen und Entscheidungspunkte sichtbar zu machen, bevor sie zu teuren Projektproblemen werden.",
        "es": "Disenado para revelar supuestos, informacion faltante, riesgos, preocupaciones de seguridad y puntos de decision antes de que se conviertan en problemas costosos.",
        "fr": "Concu pour faire apparaitre hypotheses, informations manquantes, risques, questions de securite et points de decision avant qu’ils ne deviennent des problemes couteux.",
    },
    "Clarity before complexity.": {
        "pl": "Najpierw jasnosc, potem zlozonosc.",
        "de": "Klarheit vor Komplexitaet.",
        "es": "Claridad antes que complejidad.",
        "fr": "La clarte avant la complexite.",
    },
    "ProjecTile will connect project files, engineering references, lessons learned, and team knowledge into a searchable intelligence layer.": {
        "pl": "ProjecTile polaczy pliki projektowe, referencje inzynierskie, lessons learned i wiedze zespolu w przeszukiwalna warstwe inteligencji.",
        "de": "ProjecTile verbindet Projektdateien, Engineering-Referenzen, Lessons Learned und Teamwissen zu einer durchsuchbaren Intelligenzschicht.",
        "es": "ProjecTile conectara archivos de proyecto, referencias de ingenieria, lessons learned y conocimiento del equipo en una capa de inteligencia buscable.",
        "fr": "ProjecTile reliera fichiers projet, references d’ingenierie, lessons learned et connaissance d’equipe dans une couche d’intelligence consultable.",
    },
    "Your knowledge should not disappear between projects.": {
        "pl": "Wiedza nie powinna znikac miedzy projektami.",
        "de": "Wissen sollte zwischen Projekten nicht verschwinden.",
        "es": "El conocimiento no debe desaparecer entre proyectos.",
        "fr": "La connaissance ne doit pas disparaitre entre les projets.",
    },
    "AI systems designed to support engineering work, not replace engineering judgement.": {
        "pl": "Systemy AI zaprojektowane, aby wspierac prace inzynierska, a nie zastepowac osad inzynierski.",
        "de": "AI-Systeme, die Engineering-Arbeit unterstuetzen, nicht Engineering-Urteil ersetzen.",
        "es": "Sistemas de AI disenados para apoyar el trabajo de ingenieria, no para reemplazar el criterio de ingenieria.",
        "fr": "Systemes d’AI concus pour soutenir le travail d’ingenierie, pas remplacer le jugement d’ingenierie.",
    },
    "Purpose-built software for technical teams, evidence, reports, operations, and industrial workflows.": {
        "pl": "Software tworzony dla zespolow technicznych, dowodow, raportow, operacji i workflowow przemyslowych.",
        "de": "Zweckgebautes Software fuer technische Teams, Nachweise, Berichte, Betrieb und industrielle Workflows.",
        "es": "Software creado para equipos tecnicos, evidencia, informes, operaciones y workflows industriales.",
        "fr": "Software concu pour equipes techniques, preuves, rapports, operations et workflows industriels.",
    },
    "Tools that turn repeatable engineering work into reliable digital workflows.": {
        "pl": "Narzędzia, ktore zamieniaja powtarzalna prace inzynierska w niezawodne cyfrowe workflowy.",
        "de": "Werkzeuge, die wiederholbare Engineering-Arbeit in verlaessliche digitale Workflows umsetzen.",
        "es": "Herramientas que convierten trabajo de ingenieria repetible en workflows digitales fiables.",
        "fr": "Outils qui transforment le travail d’ingenierie repetable en workflows numeriques fiables.",
    },
    "Systems that connect knowledge, decisions, evidence, calculations, and technical work.": {
        "pl": "Systemy laczace wiedze, decyzje, dowody, obliczenia i prace techniczna.",
        "de": "Systeme, die Wissen, Entscheidungen, Nachweise, Berechnungen und technische Arbeit verbinden.",
        "es": "Sistemas que conectan conocimiento, decisiones, evidencia, calculos y trabajo tecnico.",
        "fr": "Systemes qui relient connaissance, decisions, preuves, calculs et travail technique.",
    },
    "Digital structures for requirements, workflows, reports, readiness, and engineering delivery.": {
        "pl": "Cyfrowe struktury dla wymagan, workflowow, raportow, readiness i dostarczania inzynierii.",
        "de": "Digitale Strukturen fuer Anforderungen, Workflows, Berichte, Readiness und Engineering-Lieferung.",
        "es": "Estructuras digitales para requisitos, workflows, informes, readiness y entrega de ingenieria.",
        "fr": "Structures numeriques pour exigences, workflows, rapports, readiness et livraison d’ingenierie.",
    },
    "Technology thinking for assets, reliability, maintenance evidence, and operational decisions.": {
        "pl": "Myslenie technologiczne dla assetow, reliability, dowodow utrzymania i decyzji operacyjnych.",
        "de": "Technologisches Denken fuer Assets, Reliability, Wartungsnachweise und Betriebsentscheidungen.",
        "es": "Pensamiento tecnologico para activos, reliability, evidencia de mantenimiento y decisiones operativas.",
        "fr": "Pensee technologique pour assets, reliability, preuves de maintenance et decisions operationnelles.",
    },
    "Knowledge structures that preserve decisions, lessons, standards, and capability over time.": {
        "pl": "Struktury wiedzy, ktore zachowuja decyzje, lekcje, standardy i capability w czasie.",
        "de": "Wissensstrukturen, die Entscheidungen, Lehren, Standards und Capability ueber Zeit bewahren.",
        "es": "Estructuras de conocimiento que preservan decisiones, lecciones, normas y capability en el tiempo.",
        "fr": "Structures de connaissance qui preservent decisions, lecons, standards et capability dans le temps.",
    },
    "We build engineering technology with a practical industrial mindset: deterministic where it matters, AI-assisted where it helps, and traceable by design.": {
        "pl": "Budujemy technologie inzynierska z praktycznym przemyslowym podejsciem: deterministyczna tam, gdzie to wazne, wspierana przez AI tam, gdzie pomaga, i traceable z zalozenia.",
        "de": "Wir bauen Engineering-Technologie mit praktischer industrieller Denkweise: deterministisch, wo es zaehlt, AI-unterstuetzt, wo es hilft, und rueckverfolgbar by design.",
        "es": "Construimos tecnologia de ingenieria con mentalidad industrial practica: determinista donde importa, asistida por AI donde ayuda y trazable por diseno.",
        "fr": "Nous construisons une technologie d’ingenierie avec une approche industrielle pratique: deterministe quand c’est necessaire, assistee par AI quand c’est utile, et tracable par conception.",
    },
    "We start with engineering reality, constraints, safety, evidence, and useful outcomes.": {
        "pl": "Zaczynamy od rzeczywistosci inzynierskiej, ograniczen, bezpieczenstwa, dowodow i uzytecznych wynikow.",
        "de": "Wir beginnen mit Engineering-Realitaet, Randbedingungen, Sicherheit, Nachweisen und nuetzlichen Ergebnissen.",
        "es": "Empezamos con la realidad de ingenieria, restricciones, seguridad, evidencia y resultados utiles.",
        "fr": "Nous partons de la realite d’ingenierie, des contraintes, de la securite, des preuves et des resultats utiles.",
    },
    "Technology should reduce friction in real industrial work, not create another dashboard to maintain.": {
        "pl": "Technologia powinna zmniejszac tarcie w prawdziwej pracy przemyslowej, a nie tworzyc kolejny dashboard do utrzymania.",
        "de": "Technologie sollte Reibung in echter Industriearbeit reduzieren, nicht ein weiteres zu pflegendes Dashboard erzeugen.",
        "es": "La tecnologia debe reducir friccion en el trabajo industrial real, no crear otro dashboard que mantener.",
        "fr": "La technologie doit reduire la friction dans le travail industriel reel, pas creer un dashboard de plus a maintenir.",
    },
    "Engineering tools need traceability, repeatability, validation, and clear boundaries.": {
        "pl": "Narzędzia inzynierskie potrzebuja traceability, powtarzalnosci, walidacji i jasnych granic.",
        "de": "Engineering-Werkzeuge brauchen Rueckverfolgbarkeit, Wiederholbarkeit, Validierung und klare Grenzen.",
        "es": "Las herramientas de ingenieria necesitan trazabilidad, repetibilidad, validacion y limites claros.",
        "fr": "Les outils d’ingenierie ont besoin de tracabilite, repetabilite, validation et limites claires.",
    },
    "Calculations, checks, and structured outputs should be deterministic when engineering risk requires it.": {
        "pl": "Obliczenia, kontrole i uporzadkowane wyniki powinny byc deterministyczne, gdy wymaga tego ryzyko inzynierskie.",
        "de": "Berechnungen, Pruefungen und strukturierte Outputs sollten deterministisch sein, wenn Engineering-Risiko es verlangt.",
        "es": "Calculos, comprobaciones y salidas estructuradas deben ser deterministas cuando el riesgo de ingenieria lo requiere.",
        "fr": "Calculs, verifications et sorties structurees doivent etre deterministes lorsque le risque d’ingenierie l’exige.",
    },
    "Projects should improve the next project through lessons, decisions, and preserved knowledge.": {
        "pl": "Projekty powinny ulepszac nastepny projekt dzieki lekcjom, decyzjom i zachowanej wiedzy.",
        "de": "Projekte sollten das naechste Projekt durch Lehren, Entscheidungen und bewahrtes Wissen verbessern.",
        "es": "Los proyectos deben mejorar el siguiente proyecto mediante lecciones, decisiones y conocimiento preservado.",
        "fr": "Les projets doivent ameliorer le projet suivant par les lecons, decisions et connaissances conservees.",
    },
    "Industrial systems are messy, constrained, and safety-critical. The technology has to respect that.": {
        "pl": "Systemy przemyslowe sa zlozone, ograniczone i krytyczne dla bezpieczenstwa. Technologia musi to respektowac.",
        "de": "Industrielle Systeme sind unordentlich, begrenzt und sicherheitskritisch. Die Technologie muss das respektieren.",
        "es": "Los sistemas industriales son complejos, restringidos y criticos para la seguridad. La tecnologia debe respetarlo.",
        "fr": "Les systemes industriels sont complexes, contraints et critiques pour la securite. La technologie doit le respecter.",
    },
    "How the lanes come together in ProjecTile": {
        "pl": "Jak obszary lacza sie w ProjecTile",
        "de": "Wie die Bereiche in ProjecTile zusammenkommen",
        "es": "Como se unen las lineas en ProjecTile",
        "fr": "Comment les axes se rejoignent dans ProjecTile",
    },
    "Email": {"pl": "E-mail", "de": "E-Mail", "es": "Email", "fr": "E-mail"},
    "Transparent progress on ProjecTile readiness, engineering capabilities, and the public website.": {
        "pl": "Przejrzysty postep w readiness ProjecTile, capability inzynierskich i publicznej stronie.",
        "de": "Transparenter Fortschritt bei ProjecTile Readiness, Engineering-Capabilities und der oeffentlichen Website.",
        "es": "Progreso transparente en readiness de ProjecTile, capacidades de ingenieria y el sitio publico.",
        "fr": "Progression transparente sur la readiness de ProjecTile, les capacites d’ingenierie et le site public.",
    },
    "Tech Forge Collective combines industrial experience, deterministic engineering, AI, robotics, software, and knowledge systems into practical technology for technical teams.": {
        "pl": "Tech Forge Collective laczy doswiadczenie przemyslowe, deterministyczna inzynierie, AI, robotyke, software i systemy wiedzy w praktyczna technologie dla zespolow technicznych.",
        "de": "Tech Forge Collective verbindet industrielle Erfahrung, deterministisches Engineering, AI, Robotik, Software und Wissenssysteme zu praktischer Technologie fuer technische Teams.",
        "es": "Tech Forge Collective combina experiencia industrial, ingenieria determinista, AI, robotica, software y sistemas de conocimiento en tecnologia practica para equipos tecnicos.",
        "fr": "Tech Forge Collective combine experience industrielle, ingenierie deterministe, AI, robotique, software et systemes de connaissance en technologie pratique pour equipes techniques.",
    },
    "Industrial teams need AI that respects evidence, constraints, and safety.": {
        "pl": "Zespoly przemyslowe potrzebuja AI, ktora respektuje dowody, ograniczenia i bezpieczenstwo.",
        "de": "Industrieteams brauchen AI, die Nachweise, Randbedingungen und Sicherheit respektiert.",
        "es": "Los equipos industriales necesitan AI que respete evidencia, restricciones y seguridad.",
        "fr": "Les equipes industrielles ont besoin d’AI qui respecte preuves, contraintes et securite.",
    },
    "AI supports judgement by surfacing context, options, risks, and missing information.": {
        "pl": "AI wspiera osad, ujawniajac kontekst, opcje, ryzyka i brakujace informacje.",
        "de": "AI unterstuetzt Urteil, indem sie Kontext, Optionen, Risiken und fehlende Informationen sichtbar macht.",
        "es": "AI apoya el criterio mostrando contexto, opciones, riesgos e informacion faltante.",
        "fr": "L’AI soutient le jugement en faisant apparaitre contexte, options, risques et informations manquantes.",
    },
    "Pair AI reasoning with deterministic checks, source quality, human oversight, and engineering governance.": {
        "pl": "Lacz rozumowanie AI z deterministycznymi kontrolami, jakoscia zrodel, nadzorem czlowieka i governance inzynierskim.",
        "de": "AI-Reasoning mit deterministischen Checks, Quellenqualitaet, menschlicher Aufsicht und Engineering-Governance verbinden.",
        "es": "Combinar razonamiento AI con comprobaciones deterministas, calidad de fuentes, supervision humana y gobernanza de ingenieria.",
        "fr": "Associer le raisonnement AI a des controles deterministes, qualite des sources, supervision humaine et gouvernance d’ingenierie.",
    },
    "Field robotics has to handle motion, sensing, power, communications, autonomy, and operator safety together.": {
        "pl": "Robotyka terenowa musi lacznie obslugiwac ruch, sensoryke, zasilanie, komunikacje, autonomie i bezpieczenstwo operatora.",
        "de": "Feldrobotik muss Bewegung, Sensorik, Energie, Kommunikation, Autonomie und Bedienersicherheit gemeinsam beherrschen.",
        "es": "La robotica de campo debe manejar movimiento, sensorizacion, energia, comunicaciones, autonomia y seguridad del operador en conjunto.",
        "fr": "La robotique terrain doit gerer ensemble mouvement, capteurs, energie, communications, autonomie et securite operateur.",
    },
    "Robotics technologies can extend inspection, monitoring, and automation into difficult environments.": {
        "pl": "Technologie robotyczne moga rozszerzac inspekcje, monitoring i automatyzacje na trudne srodowiska.",
        "de": "Robotiktechnologien koennen Inspektion, Monitoring und Automation in schwierige Umgebungen erweitern.",
        "es": "Las tecnologias roboticas pueden extender inspeccion, monitoreo y automatizacion a entornos dificiles.",
        "fr": "Les technologies robotiques peuvent etendre inspection, surveillance et automatisation aux environnements difficiles.",
    },
    "Treat robotics as an engineering system: controls, reliability, knowledge, software, and human approval together.": {
        "pl": "Traktuj robotyke jako system inzynierski: sterowanie, reliability, wiedza, software i akceptacja czlowieka razem.",
        "de": "Robotik als Engineering-System behandeln: Steuerung, Reliability, Wissen, Software und menschliche Freigabe zusammen.",
        "es": "Tratar la robotica como sistema de ingenieria: controles, reliability, conocimiento, software y aprobacion humana juntos.",
        "fr": "Traiter la robotique comme un systeme d’ingenierie: controles, reliability, connaissance, software et approbation humaine ensemble.",
    },
    "This public roadmap shows strategic direction only. It avoids dates, internal architecture, and confidential implementation detail.": {
        "pl": "Ta publiczna roadmap pokazuje tylko kierunek strategiczny. Unika dat, architektury wewnetrznej i poufnych szczegolow implementacji.",
        "de": "Diese oeffentliche Roadmap zeigt nur die strategische Richtung. Sie vermeidet Daten, interne Architektur und vertrauliche Implementierungsdetails.",
        "es": "Esta roadmap publica muestra solo direccion estrategica. Evita fechas, arquitectura interna y detalles confidenciales de implementacion.",
        "fr": "Cette roadmap publique montre uniquement l’orientation strategique. Elle evite dates, architecture interne et details confidentiels d’implementation.",
    },
    "These updates summarize benchmark movement, completed capabilities, graph growth, known issues, and next priorities for the public ProjecTile build.": {
        "pl": "Te aktualizacje podsumowuja zmiany benchmarku, ukonczone capability, wzrost grafu, znane problemy i kolejne priorytety publicznego buildu ProjecTile.",
        "de": "Diese Updates fassen Benchmark-Bewegung, abgeschlossene Capabilities, Graph-Wachstum, bekannte Probleme und naechste Prioritaeten des oeffentlichen ProjecTile-Builds zusammen.",
        "es": "Estas actualizaciones resumen movimiento del benchmark, capacidades completadas, crecimiento del grafo, problemas conocidos y proximas prioridades del build publico de ProjecTile.",
        "fr": "Ces mises a jour resument evolution du benchmark, capacites terminees, croissance du graphe, problemes connus et prochaines priorites du build public ProjecTile.",
    },
    "Separated TFC company homepage from the ProjecTile product entry.": {
        "pl": "Oddzielono strone firmowa TFC od wejscia produktowego ProjecTile.",
        "de": "TFC-Unternehmenshomepage vom ProjecTile-Produkteinstieg getrennt.",
        "es": "Se separo la pagina corporativa de TFC de la entrada de producto ProjecTile.",
        "fr": "Separation de la page entreprise TFC et de l’entree produit ProjecTile.",
    },
    "Added dedicated ProjecTile internal navigation.": {
        "pl": "Dodano dedykowana wewnetrzna nawigacje ProjecTile.",
        "de": "Dedizierte interne ProjecTile-Navigation hinzugefuegt.",
        "es": "Se agrego navegacion interna dedicada para ProjecTile.",
        "fr": "Ajout d’une navigation interne dediee a ProjecTile.",
    },
    "Rebuilt roadmap and updates pages as structured cards.": {
        "pl": "Przebudowano strony roadmap i updates jako uporzadkowane karty.",
        "de": "Roadmap- und Update-Seiten als strukturierte Karten neu aufgebaut.",
        "es": "Se reconstruyeron las paginas roadmap y updates como tarjetas estructuradas.",
        "fr": "Reconstruction des pages roadmap et updates en cartes structurees.",
    },
    "Website readiness and product communication are moving toward public review quality.": {
        "pl": "Readiness strony i komunikacja produktu zblizaja sie do jakosci publicznego review.",
        "de": "Website-Readiness und Produktkommunikation bewegen sich Richtung oeffentlicher Review-Qualitaet.",
        "es": "La readiness del sitio y la comunicacion de producto avanzan hacia calidad de revision publica.",
        "fr": "La readiness du site et la communication produit avancent vers une qualite de revue publique.",
    },
    "No release dates, confidential stack details, or internal project names are shown.": {
        "pl": "Nie pokazujemy dat wydan, poufnych szczegolow stacku ani wewnetrznych nazw projektow.",
        "de": "Keine Release-Daten, vertraulichen Stack-Details oder internen Projektnamen werden gezeigt.",
        "es": "No se muestran fechas de lanzamiento, detalles confidenciales del stack ni nombres internos de proyecto.",
        "fr": "Aucune date de sortie, detail confidentiel de stack ou nom de projet interne n’est affiche.",
    },
    "Brand system, static website foundation, SEO baseline, repository split, and public identity.": {
        "pl": "System marki, fundament statycznej strony, baza SEO, podzial repozytoriow i publiczna tozsamosc.",
        "de": "Markensystem, statische Website-Basis, SEO-Baseline, Repository-Split und oeffentliche Identitaet.",
        "es": "Sistema de marca, base de sitio estatico, base SEO, separacion de repositorios e identidad publica.",
        "fr": "Systeme de marque, fondation du site statique, base SEO, separation des repositories et identite publique.",
    },
    "Transparent progress on ProjecTile readiness, engineering capabilities, and public website evolution.": {
        "pl": "Przejrzysty postep w readiness ProjecTile, capability inzynierskich i rozwoju publicznej strony.",
        "de": "Transparenter Fortschritt bei ProjecTile Readiness, Engineering-Capabilities und Entwicklung der oeffentlichen Website.",
        "es": "Progreso transparente en readiness de ProjecTile, capacidades de ingenieria y evolucion del sitio publico.",
        "fr": "Progression transparente sur la readiness de ProjecTile, les capacites d’ingenierie et l’evolution du site public.",
    },
    "Tech Forge Collective combines industrial experience, deterministic engineering, AI, robotics, automation, and software to build tools engineers can trust. These lanes describe company capabilities and research directions, not a list of public products.": {
        "pl": "Tech Forge Collective laczy doswiadczenie przemyslowe, deterministyczna inzynierie, AI, robotyke, automatyzacje i software, aby budowac narzedzia godne zaufania inzynierow. Te obszary opisuja capability firmy i kierunki badan, a nie liste publicznych produktow.",
        "de": "Tech Forge Collective verbindet industrielle Erfahrung, deterministisches Engineering, AI, Robotik, Automation und Software, um Werkzeuge zu bauen, denen Engineers vertrauen koennen. Diese Bereiche beschreiben Unternehmensfaehigkeiten und Forschungsrichtungen, nicht eine Liste oeffentlicher Produkte.",
        "es": "Tech Forge Collective combina experiencia industrial, ingenieria determinista, AI, robotica, automatizacion y software para crear herramientas en las que los ingenieros puedan confiar. Estas lineas describen capacidades de empresa y direcciones de investigacion, no una lista de productos publicos.",
        "fr": "Tech Forge Collective combine experience industrielle, ingenierie deterministe, AI, robotique, automatisation et software pour construire des outils fiables pour les ingenieurs. Ces axes decrivent les capacites de l’entreprise et les directions de recherche, pas une liste de produits publics.",
    },
    "Pair AI reasoning with deterministic checks, source quality, human oversight, and traceable outputs.": {
        "pl": "Lacz rozumowanie AI z deterministycznymi kontrolami, jakoscia zrodel, nadzorem czlowieka i traceable wynikami.",
        "de": "AI-Reasoning mit deterministischen Checks, Quellenqualitaet, menschlicher Aufsicht und rueckverfolgbaren Outputs verbinden.",
        "es": "Combinar razonamiento AI con comprobaciones deterministas, calidad de fuentes, supervision humana y salidas trazables.",
        "fr": "Associer le raisonnement AI a des controles deterministes, qualite des sources, supervision humaine et sorties tracables.",
    },
    "Field robotics has to handle motion, sensing, power, communications, and operator safety.": {
        "pl": "Robotyka terenowa musi obslugiwac ruch, sensoryke, zasilanie, komunikacje i bezpieczenstwo operatora.",
        "de": "Feldrobotik muss Bewegung, Sensorik, Energie, Kommunikation und Bedienersicherheit beherrschen.",
        "es": "La robotica de campo debe gestionar movimiento, sensorizacion, energia, comunicaciones y seguridad del operador.",
        "fr": "La robotique terrain doit gerer mouvement, capteurs, energie, communications et securite operateur.",
    },
    "This public roadmap shows strategic direction only. It avoids dates, internal architecture, provider details, and confidential implementation plans.": {
        "pl": "Ta publiczna roadmap pokazuje tylko kierunek strategiczny. Unika dat, architektury wewnetrznej, szczegolow providerow i poufnych planow implementacji.",
        "de": "Diese oeffentliche Roadmap zeigt nur die strategische Richtung. Sie vermeidet Daten, interne Architektur, Provider-Details und vertrauliche Implementierungsplaene.",
        "es": "Esta roadmap publica muestra solo direccion estrategica. Evita fechas, arquitectura interna, detalles de proveedores y planes confidenciales de implementacion.",
        "fr": "Cette roadmap publique montre uniquement l’orientation strategique. Elle evite dates, architecture interne, details de fournisseurs et plans confidentiels d’implementation.",
    },
    "These updates summarize benchmark movement, completed capabilities, graph growth, known limitations, and next priorities without exposing internal implementation details.": {
        "pl": "Te aktualizacje podsumowuja zmiany benchmarku, ukonczone capability, wzrost grafu, znane ograniczenia i kolejne priorytety bez ujawniania wewnetrznych szczegolow implementacji.",
        "de": "Diese Updates fassen Benchmark-Bewegung, abgeschlossene Capabilities, Graph-Wachstum, bekannte Einschraenkungen und naechste Prioritaeten zusammen, ohne interne Implementierungsdetails offenzulegen.",
        "es": "Estas actualizaciones resumen movimiento del benchmark, capacidades completadas, crecimiento del grafo, limitaciones conocidas y proximas prioridades sin exponer detalles internos de implementacion.",
        "fr": "Ces mises a jour resument evolution du benchmark, capacites terminees, croissance du graphe, limites connues et prochaines priorites sans exposer les details internes d’implementation.",
    },
    "No release dates, confidential stack details, or internal project names are exposed.": {
        "pl": "Nie ujawniamy dat wydan, poufnych szczegolow stacku ani wewnetrznych nazw projektow.",
        "de": "Keine Release-Daten, vertraulichen Stack-Details oder internen Projektnamen werden offengelegt.",
        "es": "No se exponen fechas de lanzamiento, detalles confidenciales del stack ni nombres internos de proyecto.",
        "fr": "Aucune date de sortie, detail confidentiel de stack ou nom de projet interne n’est expose.",
    },
}


def main() -> None:
    for lang in LANGS:
        path = ROOT / "i18n" / f"{lang}.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        strings = data.setdefault("strings", {})
        for key, values in FIXES.items():
            strings[key] = values[lang]
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
