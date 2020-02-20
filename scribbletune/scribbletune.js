const scribble = require('scribbletune');

function getNotesObject() {
    return {
        1: 'c0',
        2: 'd0',
        3: 'e0',
        4: 'f0',
        5: 'g0',
        6: 'a0',
        7: 'b0',

        8: 'c1',
        9: 'd1',
        a: 'e1',
        b: 'f1',
        c: 'g1',
        d: 'a1',
        e: 'b1',

        f: 'c2',
        g: 'd2',
        h: 'e2',
        i: 'f2',
        j: 'g2',
        k: 'a2',
        l: 'b2',

        m: 'c3',
        n: 'd3',
        o: 'e3',
        p: 'f3',
        q: 'g3',
        r: 'a3',
        s: 'b3',

        t: 'c4',
        u: 'd4',
        v: 'e4',
        w: 'f4',
        x: 'g4',
        y: 'a4',
        z: 'b4',

        A: 'c5',
        B: 'd5',
        C: 'e5',
        D: 'f5',
        E: 'g5',
        F: 'a5',
        G: 'b5',

        H: 'c6',
        I: 'd6',
        J: 'e6',
        K: 'f6',
        L: 'g6',
        M: 'a6',
        N: 'b6',

        O: 'c7',
        P: 'd7',
        Q: 'e7',
        R: 'f7',
        S: 'g7',
        T: 'a7',
        U: 'b7',

        V: 'c8',
        W: 'd8',
        X: 'e8',
        Y: 'f8',
        Z: 'g8'
    };
}

function makeNotesAndPatternsFromString(string) {
    const notesObject = getNotesObject();
    const stringArray = string.split(' ');
    let stringAndPatternObject = {};
    stringAndPatternObject.notes = '';
    stringAndPatternObject.pattern = '';

    for (subArray of stringArray) {
        let beforeNotes = '';
        let afterNotes = '';
        let singleNotes = subArray.split('');
        let pattern = '';
        let notes = '';

        for (singleNote of subArray) {
            if (notesObject[singleNote]) {
                beforeNotes += '[';
                afterNotes += ']';
                notes += notesObject[singleNote] + ' ';
                pattern += 'x';
            }
        }
        pattern = beforeNotes + pattern + afterNotes;
        stringAndPatternObject.notes += notes;
        stringAndPatternObject.pattern += pattern;
    }
    return stringAndPatternObject;
}

module.exports = function makeMusicFileFromString(string) {
    const clip = scribble.clip(makeNotesAndPatternsFromString(string));
    const fileName = './midiFiles/' + Date.now() + '.mid';
    scribble.midi(clip,fileName);
    return fileName;
};


//
// const clip = scribble.clip({
//     // notes: scribble.scale('c4 major'),
//     notes: 'c4 d4 e4 f4 g4 a4 b4',
//     // ' (Oct. Higher) D A G# G F D F G B B (Oct. Higher) D A G# G F D F G A# A# (Oct. Higher) D A G# G F D F G F F F F D D D F F F G G# G F D F G F F F G G# A C A D D D A D C A A A A G G G A A A A G A C A G D A G F C G F E D D D D F C F D F G G# G F ',
//     pattern: 'xxxxxxxxxx'
// });
// scribble.midi(clip);