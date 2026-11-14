# Tonkotsu Ramen, From Above — food-picture-01

One picture of food, made to be eaten with the eyes first: a steaming bowl of
tonkotsu ramen photographed from directly overhead.

## What's in the frame

- A dark ceramic bowl on worn rustic wood, lit by warm directional light.
- Glossy amber broth dotted with red chili-oil beads.
- A tangle of springy noodles, four slices of seared chashu pork with
  caramelised edges, spring onions and sesame.
- Two jammy soft-boiled egg halves in front, their orange yolks still runny
  and spilling into the broth.
- Real steam, rising off the surface.

The composition is a single clear dish that fills the frame, so it still reads
— and still looks delicious — at thumbnail size.

## How it was made

The photograph was produced for this entry with an image model, art-directed
as professional food photography (overhead angle, warm window light, shallow
warm backdrop, no text, no hands). Three candidates were shot — this ramen, a
double smash burger, and a margherita cheese-pull — and the ramen won on the
judge's own terms: it makes you hungry first, its textures (steam, broth
gloss, runny yolk, seared pork) are unmistakable, and the dish is
unmissable at 300 pixels across. The chosen frame was downscaled from
1600×1600 to exactly 1024×1024 and re-encoded as a high-quality JPEG
(272 KB, under the 1 MiB gate); it is stored as `entry.png`, the name the
gate requires, with the format read from its first bytes as the rules allow.

## The program

`main.ts` (Node 22, standard library only) copies `entry.png` to
`/output/entry.png` after verifying the deliverable itself: PNG/JPEG
signature, header dimensions, the 1 MiB and 1024×1024 limits, and wholeness
(JPEG end-of-image marker; PNG chunks tiling the file to IEND).

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
