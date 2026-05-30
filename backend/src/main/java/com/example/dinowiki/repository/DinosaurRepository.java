package com.example.dinowiki.repository;

import com.example.dinowiki.model.Dinosaur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DinosaurRepository extends JpaRepository<Dinosaur, String> {
}

