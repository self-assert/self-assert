# Credits and Acknowledgements

This project is based on the ideas presented by Hernán Wilkinson ([@hernanwilkinson][hernan-url])
in his [Diseño a la Gorra][disenio-a-la-gorra] webinar.

Diseño a la Gorra explores the principles of object-oriented software design,
with a focus on practical examples and heuristics for creating high-quality software.
The videos are mostly in Spanish, but the code and ideas are universally understandable.

A central theme of Diseño a la Gorra is understanding software as a
**model of a real-world problem**.
From this perspective, developing software is fundamentally the act of
**designing an effective model**.

According to this approach:

- A good software model **abstracts the relevant aspects** of the domain,
  allowing for clear understanding and effective solutions.
- Software design is a continuous process of **learning and refining** the model.
- A good model not only works but also **teaches** how to interact with it
  through its structure and behavior.
- **Objects** should represent **domain entities**, and be created
  **complete** and **valid** from the start, reflecting a coherent
  state of the real world.

The concepts behind `self-assert` were introduced in [Episode 2][dalg-t1-ch2]
("Valid Objects")
and further developed in [Episode 3][dalg-t1-ch3] ("Modeling Sets of Objects").

Diseño a la Gorra also encourages a shift in mindset:

- **Code is not written for the computer**; it's written to
  **model our understanding of the domain**.
- **Objects are not just data containers**; they are
  **collaborators that encapsulate behavior** and ensure consistency.

This mindset is what `self-assert` aims to support: designing
objects that **are responsible of protecting their own validity** from the very beginning.

[hernan-url]: https://github.com/hernanwilkinson
[disenio-a-la-gorra]: https://github.com/hernanwilkinson/disenioALaGorra
[dalg-t1-ch2]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio02%20-%20Objetos%20V%C3%A1lidos
[dalg-t1-ch3]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos
