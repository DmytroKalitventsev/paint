'use strict';

class Paint {
	#currentTools = {
		figure: null,
		color: '#b1b1b1',
	}

	#startCoordinate = {
		info: null,
		x: null,
		y: null,
	}

	#isDrawing = false;

	constructor() {}

	get wrap() {
		return document.querySelector('.paint')
	}

	get tools() {
		return this.wrap.querySelector('.tools')
	}

	get drawField() {
		return field;
	}

	get ctxField() {
		return this.getPainting(this.drawField);
	}

	get figures() {
		return this.wrap.querySelector('.figures');
	}

	get colors() {
		return this.wrap.querySelector('.colors');
	}

	get btnClear() {
		return this.wrap.querySelector('button');
	}

	generateFiguresBlock() {
		const dataFigures = [
			{ id: 'square', width: 80, height: 80 },
			{ id: 'circle', width: 80, height: 80 },
			{ id: 'diamond', width: 80, height: 80 },
			{ id: 'triangle', width: 80, height: 80 },
		];

		const figures = dataFigures
			.map(figure => {
				return `<label>
							<input type="radio" name="figure">
							<canvas id="${figure.id}" width="${figure.width}" height="${figure.height}""></canvas>
						</label>`;
			})
			.join('');

		this.tools.insertAdjacentHTML('afterbegin', `<div class="figures">${figures}</div>`)

		dataFigures.forEach((figure) => {
			const fieldFigure = document.getElementById(figure.id);

			this.drawFigure(fieldFigure, figure.id, figure.width, figure.height, 0, 0, '#b1b1b1');
		});
	}

	generateColorBlock() {
		const dataColors = [
			'#fff', '#d7d7d7', '#ffff00', '#b5dce9', '#ffc6d0', '#99f099', '#f08cf0',
			'#000', '#8a8a8a', '#ffad00', '#0000ff', '#ff0000', '#008a00', '#9d00d7',
		];

		const colors = dataColors
			.map(color => {
				return `<li style="background-color: ${color}"></li>`;
			})
			.join('');

		this.tools.insertAdjacentHTML(
			'beforeend',
			`<ul class="colors">
				<li class="current-color"></li>
				${colors}
			</ul>`
		);
	}

	getPainting(field) {
		if (field === null) {
			alert('Області для малювання немає');
			return false;
		}

		const picContext = field.getContext('2d');
		if (!picContext) {
			alert('Ваш браузер не підтримує малювання');
			return false;
		}

		return picContext;
	}

	drawFigure(field, figureId, width, height, x, y, color) {
		const canvas = this.getPainting(field);

		canvas.beginPath();
		canvas.fillStyle = color;

		if (figureId === 'square') {
			canvas.fillRect(x, y, width, height);
		}

		if (figureId === 'circle') {
			const centerX = x + width / 2;
			const centerY = y + height / 2;
			const radius = Math.abs(Math.min(width, height) / 2);
	
			canvas.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		}

		if (figureId === 'diamond') {
			canvas.moveTo(x + width / 2, y);
			canvas.lineTo(x + width, y + height / 2);
			canvas.lineTo(x + width / 2, y + height);
			canvas.lineTo(x, y + height / 2);
			canvas.closePath();
		}

		if (figureId === 'triangle') {
			canvas.moveTo(x, y);
			canvas.lineTo(x, y + height);
			canvas.lineTo(x + width, y + height);
			canvas.closePath();
		}

		canvas.fill();
	}

	getFigure(e) {
		const t = e.target;

		if (t.matches('canvas')) {
			this.#currentTools.figure = t.id;
		}

		if (t.matches('input')) {
			this.#currentTools.figure = t.nextElementSibling.id;
		}
	}

	getColor(e) {
		const t = e.target;

		if (t.matches('li') && !t.matches('.current-color')) {
			const showCurrentColor = t.parentElement.firstElementChild;
			const currentColor = getComputedStyle(t).backgroundColor;

			showCurrentColor.style.backgroundColor = currentColor;
			this.#currentTools.color = currentColor;
		}
	}

	startDrawing(e) {
		if (!this.#currentTools.figure) {
			alert('Виберіть фігуру');
			return;
		}

		this.#startCoordinate.x = e.offsetX;
		this.#startCoordinate.y = e.offsetY;
		this.#startCoordinate.info = this.ctxField.getImageData(0, 0, this.drawField.width, this.drawField.height);

		this.#isDrawing = true;
	}


	drawing(e) {
		if (!this.#isDrawing) return;
		this.ctxField.putImageData(this.#startCoordinate.info, 0, 0);

		const endX = e.offsetX;
		const endY = e.offsetY;

		this.drawFigure(
			this.drawField,
			this.#currentTools.figure,
			endX - this.#startCoordinate.x,
			endY - this.#startCoordinate.y,
			this.#startCoordinate.x,
			this.#startCoordinate.y,
			this.#currentTools.color
		);
	}

	stopDrawing() {
		this.#isDrawing = false
	}

	clearDraw() {
		this.ctxField.clearRect(0, 0, this.drawField.width, this.drawField.height);
	}

	init() {
		this.drawField.style.cursor = 'crosshair';
		this.generateFiguresBlock();
		this.generateColorBlock();

		this.figures.addEventListener('click', this.getFigure.bind(this));
		this.colors.addEventListener('click', this.getColor.bind(this));
		this.drawField.addEventListener('mousedown', this.startDrawing.bind(this));
		this.drawField.addEventListener('mousemove', this.drawing.bind(this));
		this.drawField.addEventListener('mouseup', this.stopDrawing.bind(this));
		this.btnClear.addEventListener('click', this.clearDraw.bind(this));
	}
}

new Paint().init();