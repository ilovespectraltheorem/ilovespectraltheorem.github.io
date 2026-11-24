+++
title = 'Maki'
description = 'A 6×6 chess variant with drops, and its own engine, Stockhorse, playable in the browser.'
repo = 'https://github.com/ilovespectraltheorem/stockknight'
demo = 'https://ilovespectraltheorem.github.io/stockknight/#/'
tech = ['Rust', 'WebAssembly', 'Python', 'JavaScript', 'Neural networks']
weight = 1
+++
Maki is a chess variant on a 6×6 board. Each side also starts with a small reserve (two pawns, a rook and a bishop), and instead of moving you may drop a reserve piece onto any empty square. I built the whole stack:

- **The rules**, frozen in one specification that every component follows.
- **Stockhorse**, a Stockfish-style alpha-beta engine written in Rust and compiled to WebAssembly so it runs in the browser, checked move for move against a JavaScript reference engine.
- **A neural-network evaluation**, trained on the engine's own self-play games and quantized for fast inference.
- **The website**: play the engine at any strength, pass and play with a friend, play online, learn the game in short lessons, or review a game with move-by-move analysis.
