export class MinQueue {
  _keys = [];
  _priorities = [];
  length = 0;
  _hasPoppedElement = false;

  bubbleUp(index) {
    const key = this._keys[index];
    const priority = this._priorities[index];

    while (index > 1) {
      const parentIndex = index >>> 1;
      if (this._priorities[parentIndex] <= priority) {
        break;
      }
      this._keys[index] = this._keys[parentIndex];
      this._priorities[index] = this._priorities[parentIndex];

      index = parentIndex;
    }

    this._keys[index] = key;
    this._priorities[index] = priority;
  }

  bubbleDown(index) {
    const key = this._keys[index];
    const priority = this._priorities[index];

    const halfLength = 1 + (this.length >>> 1);
    const lastIndex = this.length + 1;

    while (index < halfLength) {
      const left = index << 1;

      let childPriority = this._priorities[left];
      let childKey = this._keys[left];
      let childIndex = left;

      const right = left + 1;

      if (right < lastIndex) {
        const rightPriority = this._priorities[right];
        if (rightPriority < childPriority) {
          childPriority = rightPriority;
          childKey = this._keys[right];
          childIndex = right;
        }
      }

      if (childPriority >= priority) {
        break;
      }

      this._keys[index] = childKey;
      this._priorities[index] = childPriority;

      index = childIndex;
    }

    this._keys[index] = key;
    this._priorities[index] = priority;
  }

  push(key, priority) {
    if (this._hasPoppedElement) {
      this._keys[1] = key;
      this._priorities[1] = priority;
      this.length++;
      this.bubbleDown(1);
      this._hasPoppedElement = false;
    } else {
      const pos = this.length + 1;
      this._keys[pos] = key;
      this._priorities[pos] = priority;
      this.length++;
      this.bubbleUp(pos);
    }
  }

  pop() {
    if (this.length === 0) {
      return undefined;
    }

    this.removePoppedElement();

    this.length--;
    this._hasPoppedElement = true;

    return this._keys[1];
  }

  removePoppedElement() {
    if (this._hasPoppedElement) {
      this._keys[1] = this._keys[this.length + 1];
      this._priorities[1] = this._priorities[this.length + 1];

      this.bubbleDown(1);
      this._hasPoppedElement = false;
    }
  }

  get size() {
    return this.length;
  }
}

export const getMinHeap = () => new MinQueue();
