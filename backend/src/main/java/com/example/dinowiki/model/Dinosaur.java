package com.example.dinowiki.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Dinosaur {

    @Id
    private String id;

    private String name;
    private String period;
    private String years;
    private String diet;
    private String length;
    private String weight;
    private String region;

    @Column(length = 2000)
    private String description;

    @Column(name = "fun_fact", length = 1000)
    private String funFact;

    private String emoji;
    private String color;
    private String image;

    // getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getYears() { return years; }
    public void setYears(String years) { this.years = years; }

    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }

    public String getLength() { return length; }
    public void setLength(String length) { this.length = length; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFunFact() { return funFact; }
    public void setFunFact(String funFact) { this.funFact = funFact; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}

