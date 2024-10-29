# Convention de commits

## Format des commits

Les commits doivent être formattés suivant le patterne suivant : 
```
<type>(<scope>): <subject> (#<issue>)
```

Les différents `type` autorisés sont les suivants :
- `feat` : pour une nouvelle fonctionnalité
- `fix` : pour une correction de bug
- `docs` : pour une modification de la documentation
- `style` : pour une modification dans l'organisation des fichiers (espace, tabulation, etc.)
- `refactor` : pour une modification du code qui n'est ni une nouvelle fonctionnalité ni une correction de bug
- `test` : pour l'ajout de tests
- `chore` : pour une modification de type "housekeeping" (mise à jour de dépendances, etc.)
- `perf` : pour une modification visant à améliorer les performances
- `other` : pour tout autre type de modification

Le `scope` est optionnel et permet de préciser le contexte de la modification.
> Par exemple, si vous ajouter une feature sur la page de login, vous pouvez préciser `login` comme scope.
```bash
feat(login): login routes
```
Il est préférable de préciser le scope en fonction de la partie du code modifiée (api / frontend) : 
```bash
feat(api/login): login routes
```

Le `subject` est une phrase courte qui décrit la modification apportée. Anglais requis.

Le `issue` est optionnel et permet de lier le commit [à une issue du projet.](https://github.com/users/Maximauve/projects/3)