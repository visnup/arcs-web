import sharp from "sharp";

async function convert(input: string, output: string) {
  await sharp(`../arcs-ttpg/assets/Textures/${input}`).toFile(
    `./src/shapes/${output}`,
  );
}

await Promise.all([
  convert("map.jpg", "map.webp"),
  convert("ambition.jpg", "ambition.webp"),
  convert("ambition-back.jpg", "ambition-back.webp"),
  convert("ambition-declared.jpg", "ambition-declared.webp"),
  convert("block-circle.jpg", "block-circle.webp"),
  convert("block-large.png", "block-large.webp"),
  convert("block-small.png", "block-small.webp"),
  convert("resources.jpg", "resources.webp"),
  // convert("player/board.png", "player/board.webp"),
  convert("player/building-mask.png", "player/building-mask.webp"),
  convert("player/city.jpg", "player/city.webp"),
  convert("player/city-dmg.jpg", "player/city-dmg.webp"),
  convert("player/starport.jpg", "player/starport.webp"),
  convert("player/starport-dmg.jpg", "player/starport-dmg.webp"),
  convert("player/starport-dmg.jpg", "player/starport-dmg.webp"),
  convert("cards/action-back.jpg", "cards/action-back.webp"),
  convert("cards/action.jpg", "cards/action.webp"),
  convert("cards/bc-back.jpg", "cards/bc-back.webp"),
  convert("cards/bc.jpg", "cards/bc.webp"),
  convert("cards/leader-2.jpg", "cards/leader-2.webp"),
  convert("cards/leader-back.jpg", "cards/leader-back.webp"),
  convert("cards/leader.jpg", "cards/leader.webp"),
  convert("cards/lore-2.jpg", "cards/lore-2.webp"),
  convert("cards/lore-back.jpg", "cards/lore-back.webp"),
  convert("cards/lore.jpg", "cards/lore.webp"),
  convert("cards/setup-back.jpg", "cards/setup-back.webp"),
  convert("cards/setup.jpg", "cards/setup.webp"),
]);
