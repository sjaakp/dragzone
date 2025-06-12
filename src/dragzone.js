/*
 *  dragzone.js - drag small HTML element(s) inside a bigger element.
 *  Version 1.0.0
 *  (c) Sjaak Priester, Amsterdam, 2025 MIT license
 *  https://sjaakpriester.nl/software/dragzone
 *  https://github.com/sjaakp/dragzone
 */

function DragZone(elmt)
{
    this.zone = elmt;
    elmt.dragzone = this;
    this.disabled = elmt.dataset.disable !== undefined;
    if (this.disabled) this.disable();
    this.precision = +(elmt.dataset.precision || 3);

    this.onPointerMove = function (evt) {
        const dx = evt.pageX - this.x,
            dy = evt.pageY - this.y,
            w2 = this.dragged.offsetWidth / 2,
            h2 = this.dragged.offsetHeight / 2;

        this.x = evt.pageX;
        this.y = evt.pageY;

        const left = Math.min(
            Math.max(this.dragged.offsetLeft + dx, - w2),
            this.zone.clientWidth - w2
        ),
            top = Math.min(
                Math.max(this.dragged.offsetTop + dy, - h2),
                this.zone.clientHeight - h2
            ),
            style = this.dragged.style;

        style.left = `${left}px`;
        style.top = `${top}px`;
    }.bind(this);

    this.onPointerUp = function () {
        console.log(this.getPositions({ changed: this.dragged.dataset.draggable }));

        this.zone.dispatchEvent(new CustomEvent('dragzone.changed', {
            detail: this.getPositions({ changed: this.dragged.dataset.draggable })
        }));
        document.removeEventListener('pointerup', this.onPointerUp);
        this.zone.removeEventListener('pointermove', this.onPointerMove);
    }.bind(this);

    elmt.querySelectorAll('[data-draggable]').forEach(elt => {
        elt.addEventListener('pointerdown', evt => {
            if (! this.disabled) {
                this.dragged = evt.target;
                this.x = evt.pageX;
                this.y = evt.pageY;
                document.addEventListener('pointerup', this.onPointerUp);
                this.zone.addEventListener('pointermove', this.onPointerMove);
                this.zone.dispatchEvent(new CustomEvent('dragzone.changing', {
                    detail: this.getPositions({ changing: this.dragged.dataset.draggable })
                }));
            }
        });
    });

    const positions = elmt.dataset.dragzone;

    if (positions) {
        this.setPositions(positions)
    } else {
        this.home();
    }

    // console.log(this);
}

DragZone.prototype = {
    home() {
        let y = 0;
        this.zone.querySelectorAll('[data-draggable]').forEach(elt => {
            elt.style.left = '0';
            elt.style.top = `${y}px`;
            y += elt.offsetHeight + 2;
        });
    },

    getPositions(extra = {}) {
        this.zone.querySelectorAll('[data-draggable]').forEach(elt => {
            extra[elt.dataset.draggable] = {
                x: ((elt.offsetLeft + elt.offsetWidth / 2) / this.zone.clientWidth).toPrecision(this.precision),
                y: ((elt.offsetTop + elt.offsetHeight / 2) / this.zone.clientHeight).toPrecision(this.precision)
            };
        });
        return JSON.stringify(extra, null, 2);
    },

    setPositions(json) {
        const data = JSON.parse(json);
        this.zone.querySelectorAll('[data-draggable]').forEach(elt => {
            const setting = data[elt.dataset.draggable];
            if (setting) {
                const x = setting.x * this.zone.clientWidth - elt.offsetWidth / 2,
                    y = setting.y * this.zone.clientHeight - elt.offsetHeight / 2

                elt.style.left = `${x}px`;
                elt.style.top = `${y}px`;
            }
        });
    },

    enable() {
        this.disabled = false;
        this.zone.classList.remove('zone-disabled');
    },

    disable() {
        this.disabled = true;
        this.zone.classList.add('zone-disabled');
    },
};

const style = document.createElement('style');
style.appendChild(document.createTextNode(`[data-dragzone]{position:relative;overflow:clip;}
[data-draggable]{position:absolute;top:0;left:0;user-select:none;cursor:move;}.zone-disabled [data-draggable] {cursor: auto;}`));
document.head.appendChild(style);

document.querySelectorAll('[data-dragzone]').forEach(elt => {
    new DragZone(elt);
});
