package com.openclassrooms.mddapi.repository;
import com.openclassrooms.mddapi.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByTopicId(Long topicId);

    List<Article> findByAuthorId(Long authorId);

    List<Article> findByTopicIdOrderByCreatedAtDesc(Long topicId);
}