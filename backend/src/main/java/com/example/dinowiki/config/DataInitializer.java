package com.example.dinowiki.config;

import com.example.dinowiki.model.Dinosaur;
import com.example.dinowiki.repository.DinosaurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DinosaurRepository repo;

    public DataInitializer(DinosaurRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() > 0) return;

        List<Dinosaur> seeds = new ArrayList<>();

        seeds.add(make("trex","Tyrannosaurus Rex","Cretaceous","68–66 milioane ani în urmă","Carnivor","12–13 metri","8–14 tone","America de Nord",
            "Regele prădătorilor! T. Rex era unul dintre cei mai mari dinozauri carnivori care au trăit vreodată. Cu dinți de 20 cm și o forță de mușcătură imensă, era vânătorul suprem al epocii sale. Deși brațele sale erau mici, picioarele sale puternice îi permiteau să atingă viteze de 20 km/h.",
            "T. Rex avea o vedere binoculară mai bună decât un vultur modern, perfect pentru urmărirea prăzii.","🦖","#8B2500","/images/tyrannosaurus.jpg"));

        seeds.add(make("triceratops","Triceratops","Cretaceous","68–66 milioane ani în urmă","Ierbivor","8–9 metri","6–12 tone","America de Nord",
            "Triceratops era un ierbivor masiv cu trei coarne impresionante și un guler osos elaborat. Trăia în turme și folosea coarnele atât pentru apărare împotriva prădătorilor, cât și pentru lupte teritoriale cu alți membri ai speciei sale.",
            "Gulerele lor puteau fi colorate viu pentru a atrage perechile — asemeni unor păsări de paradis preistorice!","🦕","#5B6E1A","/images/triceratops.jpg"));

        seeds.add(make("velociraptor","Velociraptor","Cretaceous","75–71 milioane ani în urmă","Carnivor","1.8–2 metri","15–20 kg","Asia Centrală",
            "Contrar imaginii din filme, Velociraptorul era de fapt mărimea unui curcan — dar acoperit cu pene! Era un vânător extrem de inteligent și rapid, folosind ghearele sale retractabile ca arme de precizie. Vâna probabil în grup, coordonând atacuri complexe.",
            "Velociraptorul real era acoperit cu pene și probabil arăta mai mult ca o pasăre exotică decât ca un reptil.","🦅","#7A5C2E","/images/velociraptor.jpg"));

        seeds.add(make("brachiosaurus","Brachiosaurus","Jurassic","154–153 milioane ani în urmă","Ierbivor","26 metri","30–60 tone","America de Nord, Africa",
            "Brachiosaurus era unul dintre cei mai înalți dinozauri, putând ajunge la 16 metri înălțime. Cu gâtul enorm orientat în sus, se hrănea cu vârfurile copacilor. Inima sa trebuia să pompeze sânge cu o forță incredibilă pentru a iriga creierul.",
            "Brachiosaur consuma până la 400 kg de vegetație pe zi — echivalentul a câteva mii de salate!","🌿","#3D6B35","/images/brachiosaurus.jpg"));

        seeds.add(make("stegosaurus","Stegosaurus","Jurassic","155–150 milioane ani în urmă","Ierbivor","9 metri","5–7 tone","America de Nord, Europa",
            "Stegosaurus este recunoscut imediat după plăcile osoase de pe spate și coada cu spini. Aceste plăci conțineau vase de sânge și puteau fi folosite pentru reglarea temperaturii corporale. Coada cu patru spini, numită 'thagomizer', era o armă redutabilă.",
            "Creierul Stegosaurusului era de mărimea unei nuci de cocos — unul dintre cele mai mici, raportat la dimensiunea corpului.","🌵","#4A7A3A","/images/stegosaurus.jpg"));

        seeds.add(make("pterodactyl","Pterodactylus","Jurassic","150–148 milioane ani în urmă","Carnivor","Anvergura aripilor: 1.5 metri","1–2 kg","Europa, Africa",
            "Deși adesea confundat cu un dinozaur, Pterodactylus era de fapt un reptil zburător — un pterozaur. Avea o creastă osoasă pe cap și un cioc lung cu dinți. Zbura deasupra mărilor și lacurilor, pescuind cu precizie ca o pescăruș preistoric.",
            "Pterodactylus putea să meargă pe patru membre pe pământ, pliindu-și aripile ca niște brațe — similar cu liliecii de astăzi.","🦇","#6B5B8A","/images/pterodactylus.jpg"));

        seeds.add(make("ankylosaurus","Ankylosaurus","Cretaceous","68–66 milioane ani în urmă","Ierbivor","8–10 metri","4–8 tone","America de Nord",
            "Ankylosaurus era dinozaurul-tanc al lumii preistorice. Acoperit de plăci osoase masive și cu o coadă terminată într-un 'buzdugan' osos, era practic inexpugnabil. Nici T. Rex nu putea străpunge armura sa naturală.",
            "Coada-buzdugan a Ankylosaurusului putea rupe oasele unui T. Rex — o singură lovitură putea fi fatală pentru atacator!","🛡️","#6B5A2E","/images/ankylosaurus.jpg"));

        seeds.add(make("spinosaurus","Spinosaurus","Cretaceous","99–93 milioane ani în urmă","Carnivor","14–18 metri","7–20 tone","Africa de Nord",
            "Spinosaurus era cel mai mare dinozaur carnivor cunoscut — chiar mai mare decât T. Rex! Pânza spinoasă de pe spate putea atinge 1.8 metri înălțime. Era semi-acvatic, petrecând mult timp în apă și vânând pești uriași.",
            "Spinosaurus era un înotător excelent — osatura sa densă îl ajuta să se scufunde, la fel ca a unui hipopotam modern.","🐊","#2E6B5A","/images/spinosaurus.jpg"));

        repo.saveAll(seeds);
    }

    private Dinosaur make(String id, String name, String period, String years, String diet,
                           String length, String weight, String region, String description,
                           String funFact, String emoji, String color, String image) {
        Dinosaur d = new Dinosaur();
        d.setId(id); d.setName(name); d.setPeriod(period); d.setYears(years);
        d.setDiet(diet); d.setLength(length); d.setWeight(weight); d.setRegion(region);
        d.setDescription(description); d.setFunFact(funFact);
        d.setEmoji(emoji); d.setColor(color); d.setImage(image);
        return d;
    }
}