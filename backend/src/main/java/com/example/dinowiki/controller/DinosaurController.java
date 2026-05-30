package com.example.dinowiki.controller;

import com.example.dinowiki.model.Dinosaur;
import com.example.dinowiki.repository.DinosaurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dinosaurs")
public class DinosaurController {

    private final DinosaurRepository repo;

    public DinosaurController(DinosaurRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Dinosaur> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dinosaur> get(@PathVariable String id) {
        Optional<Dinosaur> d = repo.findById(id);
        return d.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Dinosaur> create(@RequestBody Dinosaur dino) {
        if (dino.getId() == null || dino.getId().isEmpty()) return ResponseEntity.badRequest().build();
        if (repo.existsById(dino.getId())) return ResponseEntity.status(409).build();
        Dinosaur saved = repo.save(dino);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dinosaur> update(@PathVariable String id, @RequestBody Dinosaur dino) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        dino.setId(id);
        Dinosaur saved = repo.save(dino);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

