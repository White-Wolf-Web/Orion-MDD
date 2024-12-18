import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import { ArticleDto } from 'src/app/models/article.model';
import { ArticleCardComponent } from 'src/app/components/cards/article-card/article-card.component';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  imports: [ArticleCardComponent, ButtonComponent, CommonModule],
  standalone: true,
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: ArticleDto[] = [];                     // Liste des articles affichés.
  isAscending: boolean = true;                     // Indique si les articles sont triés par date croissante ou décroissante.
  subscribedTopics: number[] = [];                 // Liste des IDs des thèmes auxquels l'utilisateur est abonné.
  private subscriptions = new Subscription();      // Gère tous les abonnements

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token non disponible. Veuillez vous connecter.');
      this.router.navigate(['/login']);
    }

    // Étape 1 : Récupérer les abonnements de l'utilisateur
    this.userService.getUserSubscriptions().subscribe({
      next: (topics) => {
        const topicNames = topics.map((topic) => topic.name);
        console.log('Topic Names souscrits:', topicNames);

        // Étape 2 : Récupérer tous les articles et filtrer
        this.articleService.getAllArticles().subscribe({
          next: (data) => {
            console.log('Articles récupérés:', data);
            this.articles = data.filter((article) => {
              const articleTopicName = article.topic?.name || article.topicName;

              if (!articleTopicName) {
                console.log(
                  `Article ${
                    article.id || 'ID non défini'
                  } n'a pas de topic défini. Détails de l'article :`,
                  {
                    id: article.id,
                    title: article.title,
                    authorUsername: article.authorUsername,
                    createdAt: article.createdAt,
                    content: article.content,
                    topicName: article.topicName,
                  }
                );
                return false; // Exclut les articles sans topic
              }

              // Vérifie si l'article appartient à un thème auquel l'utilisateur est abonné.
              const match = topicNames.includes(articleTopicName);
              console.log(
                `Article ${article.id} avec topic '${articleTopicName}' correspond :`,
                match
              );
              return match;
            });
          },
          error: (error) =>
            console.error(
              'Erreur lors de la récupération des articles:',
              error
            ),
        });
      },
      error: (error) =>
        console.error(
          'Erreur lors de la récupération des souscriptions:',
          error
        ),
    });
  }

  // Nettoyage des abonnements lorsque le composant est détruit
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    console.log(
      'Tous les abonnements dans ArticleListComponent ont été annulés.'
    );
  }

  // Rediriger vers la page de création d'article
  createArticle() {
    this.router.navigate(['articles/create']);
  }

  // Triage des articles par date
  sortArticles(isAscending: boolean) {
    this.articles.sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  // Émet un événement lorsque les articles sont triés.
  @Output() sort = new EventEmitter<boolean>();

  onSort() {
    this.isAscending = !this.isAscending;
    this.sort.emit(this.isAscending);
    this.sortArticles(this.isAscending); // Trier après chaque clic
  }
}
