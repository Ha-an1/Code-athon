from flask import Flask, request, jsonify, render_template
import ImCap
import speak

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('run.html')

@app.route('/guide')
def guide():
    return render_template('guidePage.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    answer = ImCap.check(question)
    return jsonify({'result': answer})

@app.route('/speak', methods=['POST'])
def spoke():
    data =request.json
    word=data.get('word')
    if not word:
        return jsonify({'error': 'No question provided'}), 400
    answer = speak.speaks(word)
    return jsonify({'result': answer})


if __name__ == '__main__':
    app.run(debug=True)
