# self-assert

A TypeScript library for creating valid objects,
promoting encapsulation and robust design.

> [!warning]
> This project is in its early stages. It is meant to be published soon.

## Table of Contents

- [Credits and Acknowledgements](#credits-and-acknowledgements)
- [Installation](#installation)

## Credits and Acknowledgements

This project is based on the ideas presented by Hernán Wilkinson ([@hernanwilkinson][hernan-url])
in his [Diseño a la Gorra][disenio-a-la-gorra] webinar.

Diseño a la Gorra is a webinar exploring the principles of object-oriented software design,
with a focus on practical examples and heuristics for creating high-quality software.
The videos are primarily in Spanish; however, the code is self-explanatory.

A core idea of Diseño a la Gorra is understanding software as a **model of a real-world problem**.
Developing software, therefore, is fundamentally the act of **designing an effective model**.

According to this perspective:

- A good software model **abstracts the relevant aspects** of the problem domain,
  allowing for clear understanding and effective solutions.
- Software design is a continuous process of **learning and refining** the model.
- A good model not only works but also **teaches** how to interact with it through its structure and behavior.
- **Objects** within the software should represent **entities of the domain** and be created
  **complete** and **valid** from the outset, reflecting a coherent state of the real world.

The concepts behind `self-assert` were introduced in [Episode 2][dalg-t1-ch2] ("Valid Objects")
and further refined in [Episode 3][dalg-t1-ch3] ("Modeling Sets of Objects").

## Installation

Install `self-assert` with `npm`:

```shell
npm install self-assert
```

<!-- ## Usage -->

[hernan-url]: https://github.com/hernanwilkinson
[disenio-a-la-gorra]: https://github.com/hernanwilkinson/disenioALaGorra
[dalg-t1-ch2]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio02%20-%20Objetos%20V%C3%A1lidos
[dalg-t1-ch3]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos
