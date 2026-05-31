package com.example.dinowiki.controller;

import com.example.dinowiki.model.Dinosaur;
import com.example.dinowiki.repository.DinosaurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;

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

    private String validate(Dinosaur dino) {
        if (dino == null) return "Payload invalid";
        if (dino.getId() == null || dino.getId().trim().isEmpty()) return "id este obligatoriu";
        if (dino.getName() == null || dino.getName().trim().isEmpty()) return "name este obligatoriu";
        if (dino.getDiet() == null || dino.getDiet().trim().isEmpty()) return "diet este obligatoriu";
        if (dino.getImage() == null || dino.getImage().trim().isEmpty()) return "image este obligatoriu";
        // word limits
        int nameWords = dino.getName().trim().split("\\s+").length;
        if (nameWords > 8) return "name are prea multe cuvinte (max 8)";
        int dietWords = dino.getDiet().trim().split("\\s+").length;
        if (dietWords > 4) return "diet are prea multe cuvinte (max 4)";
        // ok
        return null;
    }

    private String saveImageIfDataUrl(String id, String image) {
        if (image == null) return null;
        if (!image.startsWith("data:")) return image; // already a URL/path

        int comma = image.indexOf(',');
        if (comma < 0) throw new RuntimeException("Invalid data URL for image");
        String meta = image.substring(5, comma); // e.g. image/png;base64
        String base64 = image.substring(comma + 1);
        String mime = meta.split(";")[0];
        String ext = "png";
        if ("image/jpeg".equals(mime) || "image/jpg".equals(mime)) ext = "jpg";
        else if ("image/gif".equals(mime)) ext = "gif";
        else if ("image/webp".equals(mime)) ext = "webp";
        else if ("image/svg+xml".equals(mime)) ext = "svg";

        String fname = id.replaceAll("[^a-zA-Z0-9_-]", "_");
        String filename = fname + "." + ext;
        Path imagesDir = Paths.get("images");
        try {
            Files.createDirectories(imagesDir);
            Path file = imagesDir.resolve(filename);
            byte[] bytes = Base64.getDecoder().decode(base64);
            Files.write(file, bytes);
            // return web path
            return "/images/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not save image file", e);
        }
    }

    private void ensureDefaults(Dinosaur dino) {
        if (dino.getEmoji() == null || dino.getEmoji().trim().isEmpty()) dino.setEmoji("🦕");
        if (dino.getColor() == null || dino.getColor().trim().isEmpty()) dino.setColor("#c8960c");
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Dinosaur dino) {
        String err = validate(dino);
        if (err != null) return ResponseEntity.badRequest().body(err);
        if (repo.existsById(dino.getId())) return ResponseEntity.status(409).body("id already exists");

        // save image file if it's a data URL
        String img = dino.getImage();
        if (img != null && img.startsWith("data:")) {
            String savedPath = saveImageIfDataUrl(dino.getId(), img);
            dino.setImage(savedPath);
        }

        ensureDefaults(dino);
        Dinosaur saved = repo.save(dino);
        return ResponseEntity.created(URI.create("/api/dinosaurs/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Dinosaur dino) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        // ensure payload id matches path id (or set it)
        dino.setId(id);
        String err = validate(dino);
        if (err != null) return ResponseEntity.badRequest().body(err);

        // handle image data URL
        String img = dino.getImage();
        if (img != null && img.startsWith("data:")) {
            String savedPath = saveImageIfDataUrl(dino.getId(), img);
            dino.setImage(savedPath);
        }

        ensureDefaults(dino);
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
