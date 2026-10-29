
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { hint: '', seen: {}, levels: { push: 0, pull: 0, legs: 0, core: 0, balance: 0, dance: 0, strikes: 0, stretch: 0, mobility: 0, freezes: 0, splits: 0, crawls: 0, flow: 0 }, fb: 0, pathOpen: null, celebrate: false, moveOpen: null, moveFrom: 'session', query: '', tried: {}, history: this.seedHistory(), calm: false, sound: true, chatter: true, resting: false, askFb: false, fbMsg: '', phrase: 0, visited: false, pets: 0, homePets: 0, petting: false, screen: 'checkin', time: 20, energy: 50, mood: 'Surprise', seed: 0, swaps: {}, idx: 0, remaining: 0, paused: false, expanding: false, expandColor: '#1556C2' };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 1000);
    try { const raw = localStorage.getItem('noodle-v1'); if (raw) { const o = JSON.parse(raw); const keep = {}; ['levels', 'history', 'tried', 'seen', 'fb', 'calm', 'sound', 'chatter', 'time', 'energy', 'mood'].forEach((k) => { if (o[k] !== undefined) keep[k] = o[k]; }); if (keep.levels) keep.levels = Object.assign({}, this.state.levels, keep.levels); this.setState(keep); } } catch (e) {}
  }
  componentDidUpdate() {
    const s = this.state;
    try { const o = {}; ['levels', 'history', 'tried', 'seen', 'fb', 'calm', 'sound', 'chatter', 'time', 'energy', 'mood'].forEach((k) => { o[k] = s[k]; }); const str = JSON.stringify(o); if (str !== this._saved) { localStorage.setItem('noodle-v1', str); this._saved = str; } } catch (e) {}
    const want = s.screen === 'player' && !s.paused;
    try {
      if (want && !this.lock && !this.locking && navigator.wakeLock) { this.locking = true; navigator.wakeLock.request('screen').then((l) => { this.lock = l; this.locking = false; l.addEventListener('release', () => { this.lock = null; }); }).catch(() => { this.locking = false; }); }
      if (!want && this.lock) { this.lock.release().catch(() => {}); this.lock = null; }
    } catch (e) {}
  }
  ensureAudio() { try { if (!this.ac) this.ac = new (window.AudioContext || window.webkitAudioContext)(); if (this.ac.state === 'suspended') this.ac.resume(); } catch (e) {} }
  beep(freq, dur) {
    if (!this.state.sound || !this.ac) return;
    try { const o = this.ac.createOscillator(), g = this.ac.createGain(), t0 = this.ac.currentTime; o.type = 'sine'; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g); g.connect(this.ac.destination); o.start(t0); o.stop(t0 + dur + 0.05); } catch (e) {}
  }
  componentWillUnmount() { clearInterval(this.timer); clearTimeout(this.tt); clearTimeout(this.pt); clearTimeout(this.ct); }
  seedHistory() {
    const h = {}, today = new Date().getDate();
    const keys = ['push', 'dance', 'stretch', 'legs', 'strikes', 'core', 'mobility', 'pull', 'balance'];
    const n = new Date(), pre = n.getFullYear() + '-' + (n.getMonth() + 1) + '-';
    for (let d = 1; d < today; d++) { if ((d * 7 + 3) % 10 < 6) h[pre + d] = keys[(d * 5) % 9]; }
    return h;
  }
  bankRows() {
    return [
      ['Wall push-up', 'push', 0, 'm', '3 × 12', 'wallpush', 'Hands on the wall at shoulder height.', 'Chest to the wall, then push away.'],
      ['Wide wall push-up', 'push', 0, 'v', '3 × 12', 'wallpush', 'Hands wider than your shoulders.', 'Keep your body in one straight line.'],
      ['Close-hand wall push-up', 'push', 0, 'v', '3 × 10', 'wallpush', 'Hands close together under your chest.', 'Elbows brush your ribs as you lower.'],
      ['Incline push-up', 'push', 1, 'm', '3 × 10', 'incline', 'Hands on a sturdy desk, body straight.', 'Lower your chest to the edge, then press away.'],
      ['Knee push-up', 'push', 1, 'v', '3 × 10', 'kneepush', 'Knees down, hips in line with your shoulders.', 'Chest to a fist above the floor.'],
      ['Bed-height incline push-up', 'push', 1, 'v', '3 × 10', 'incline', 'Hands on the bed frame.', 'Lower surface means harder, so go slow.'],
      ['Bench dip', 'push', 1, 'v', '3 × 10', 'dip', 'Hands on the bed edge behind you.', 'Lower until your elbows reach about 90 degrees.', ['arms', 'chest'], ['arms']],
      ['Push-up', 'push', 2, 'm', '3 × 8', 'pushup', 'Squeeze glutes and brace so your hips do not sag.', 'Chest to a fist above the floor every rep.'],
      ['Wide push-up', 'push', 2, 'v', '3 × 8', 'pushup', 'Hands about one and a half shoulder widths apart.', 'Same straight body line.'],
      ['Diamond push-up', 'push', 2, 'v', '3 × 6', 'pushup', 'Thumbs and index fingers touch under your chest.', 'Elbows stay close to your ribs.', ['arms', 'chest'], ['arms']],
      ['Hand-release push-up', 'push', 2, 'v', '3 × 6', 'pushup', 'Lower all the way and lift your hands briefly.', 'Press back up as one solid piece.'],
      ['Chair dip', 'push', 2, 'v', '3 × 8', 'dip', 'Hands on two sturdy chairs, arms straight.', 'Lean slightly forward and lower with control.', ['arms', 'chest'], ['arms']],
      ['Archer push-up', 'push', 3, 'm', '3 × 5 per side', 'pushup', 'Hands very wide.', 'Lower toward one hand while the other arm stays straight.'],
      ['Decline push-up', 'push', 3, 'v', '3 × 8', 'decline', 'Feet on the bed, hands on the floor.', 'Keep your hips from piking up.', ['chest', 'shoulders', 'arms'], ['shoulders']],
      ['Pike push-up', 'push', 3, 'v', '3 × 8', 'pike', 'Hips high in an upside-down V.', 'Lower your head toward the floor, then press up.', ['shoulders', 'arms'], ['shoulders', 'arms']],
      ['Pseudo-planche push-up', 'push', 3, 'v', '3 × 6', 'pushup', 'Hands by your waist, fingers turned out.', 'Lean your shoulders past your hands the whole rep.', ['shoulders', 'chest', 'core'], ['arms']],
      ['One-arm push-up', 'push', 4, 'm', '3 × 3 per side', 'pushup', 'Feet wide, free hand behind your back.', 'Fight the twist so your hips stay square.', ['chest', 'shoulders', 'arms', 'core'], ['arms']],
      ['Elevated pike push-up', 'push', 4, 'v', '3 × 6', 'pike', 'Feet on the bed so your hips stack over your shoulders.', 'Your head travels just in front of your hands.', ['shoulders', 'arms'], ['shoulders', 'arms']],
      ['Wall handstand push-up negative', 'push', 4, 'v', '3 × 3', 'handstand', 'Kick up to the wall.', 'Lower your head to a folded towel over 4 seconds.', ['shoulders', 'arms'], ['shoulders', 'arms']],

      ['Prone Y-T-W raises', 'pull', 0, 'm', '2 × 8 each shape', 'ytw', 'Lie face down, forehead on a towel.', 'Lift your arms in a Y, then a T, then a W.', [], ['back', 'shoulders']],
      ['Towel pull-apart', 'pull', 0, 'v', '3 × 20 s', 'pullapart', 'Hold a towel at chest height, arms straight.', 'Pull outward as hard as you can and hold.', ['shoulders'], ['back', 'shoulders']],
      ['Superman hold', 'pull', 0, 'v', '3 × 20 s', 'superman', 'Lie face down, arms reaching forward.', 'Lift your arms, chest and legs and look at the floor.', [], ['back', 'lowback', 'glutes']],
      ['Under-desk row, knees bent', 'pull', 1, 'm', '3 × 8', 'row', 'Lie under a sturdy desk and grip the edge.', 'Pull your chest up with your knees bent and feet flat.'],
      ['Towel floor pull', 'pull', 1, 'v', '3 × 6', 'ytw', 'Lie face down on a towel on a smooth floor.', 'Pull yourself forward with your forearms.'],
      ['Reverse snow angel', 'pull', 1, 'v', '3 × 10', 'ytw', 'Lie face down, arms by your sides.', 'Sweep your arms overhead and back without touching down.', [], ['back', 'shoulders']],
      ['Under-desk row, legs straight', 'pull', 2, 'm', '3 × 8', 'row', 'Body straight from heels to head.', 'Pull until your chest nearly touches the edge.'],
      ['Paused desk row', 'pull', 2, 'v', '3 × 6', 'row', 'Pull up and hold 2 seconds at the top.', 'Squeeze your shoulder blades together.'],
      ['Close-grip desk row', 'pull', 2, 'v', '3 × 8', 'row', 'Hands close together on the edge.', 'Elbows travel close to your body.'],
      ['Archer desk row', 'pull', 3, 'm', '3 × 5 per side', 'row', 'Hands wide on the edge.', 'Pull toward one hand while the other arm straightens.'],
      ['Feet-up desk row', 'pull', 3, 'v', '3 × 8', 'row', 'Heels up on the bed so your body is level.', 'Pull your chest to the edge.'],
      ['Slow-negative desk row', 'pull', 3, 'v', '3 × 6', 'row', 'Pull up normally.', 'Take 4 full seconds to lower.'],
      ['One-arm desk row', 'pull', 4, 'm', '3 × 4 per side', 'row', 'One hand on the edge, feet wide for balance.', 'Pull without letting your hips twist.'],
      ['One-arm row negative', 'pull', 4, 'v', '3 × 3 per side', 'row', 'Get to the top with two hands.', 'Let go with one and lower slowly.'],
      ['Feet-up archer row', 'pull', 4, 'v', '3 × 4 per side', 'row', 'Heels on the bed, hands wide.', 'Pull toward one hand at a time.'],

      ['Chair squat', 'legs', 0, 'm', '3 × 10', 'chairsquat', 'Sit down to a chair, then stand.', 'Push through your whole foot.'],
      ['Wall sit', 'legs', 0, 'v', '3 × 30 s', 'wallsit', 'Back flat on the wall, thighs level.', 'Knees over ankles, breathe steadily.', ['legs'], ['glutes']],
      ['Glute bridge', 'legs', 0, 'v', '3 × 15', 'glutebridge', 'Lie on your back, feet flat.', 'Drive through your heels and squeeze at the top.', ['hips'], ['glutes', 'hamstrings', 'lowback']],
      ['Calf raise', 'legs', 0, 'v', '3 × 20', 'calf', 'Rise as high as you can.', 'Pause, then lower slowly.', ['legs'], ['hamstrings']],
      ['Bodyweight squat', 'legs', 1, 'm', '3 × 15', 'squat', 'Feet shoulder width, toes slightly out.', 'Sit down until your thighs are at least level.'],
      ['Reverse lunge', 'legs', 1, 'v', '3 × 10 per side', 'lunge', 'Step back and lower the back knee.', 'Push through the front heel to stand.'],
      ['Split squat', 'legs', 1, 'v', '3 × 10 per side', 'lunge', 'Long stance, back heel up.', 'Drop the back knee straight down.'],
      ['Single-leg glute bridge', 'legs', 1, 'v', '3 × 10 per side', 'glutebridge', 'One foot down, the other leg straight up.', 'Lift without letting your hips tilt.', ['hips'], ['glutes', 'hamstrings']],
      ['Bulgarian split squat', 'legs', 2, 'm', '3 × 8 per side', 'bulgarian', 'Back foot on the bed.', 'Take 3 seconds on the way down.'],
      ['Cossack squat', 'legs', 2, 'v', '3 × 6 per side', 'cossack', 'Wide stance, sit down into one leg.', 'Keep the other leg straight, toes up.'],
      ['Single-leg calf raise', 'legs', 2, 'v', '3 × 12 per side', 'calf', 'Hold a wall for balance.', 'Full range, slow on the way down.', ['legs'], ['hamstrings']],
      ['Hip thrust', 'legs', 2, 'v', '3 × 12', 'glutebridge', 'Shoulders against the bed edge.', 'Lift your hips until your body is a flat table.', ['hips'], ['glutes', 'hamstrings']],
      ['Pistol squat to the bed', 'legs', 3, 'm', '3 × 5 per side', 'pistol', 'Squat on one leg down to the bed.', 'The other leg reaches forward.'],
      ['Assisted shrimp squat', 'legs', 3, 'v', '3 × 5 per side', 'lunge', 'Hold your back foot, other hand on a wall.', 'Lower the back knee to a pillow.'],
      ['Single-leg Romanian deadlift', 'legs', 3, 'v', '3 × 8 per side', 'rdl', 'Hinge at the hip on one leg.', 'Back leg and chest move together like a seesaw.', ['hips'], ['hamstrings', 'glutes', 'lowback']],
      ['Reverse Nordic', 'legs', 3, 'v', '3 × 6', 'nordic', 'Kneel on something soft, body straight.', 'Lean back slowly, then pull yourself up.', ['legs', 'core'], []],
      ['Pistol squat', 'legs', 4, 'm', '3 × 5 per side', 'pistol', 'Full depth on one leg.', 'Arms forward to balance.'],
      ['Shrimp squat', 'legs', 4, 'v', '3 × 4 per side', 'lunge', 'Hold your back foot behind you.', 'Touch the back knee down and stand.'],
      ['Slow pistol', 'legs', 4, 'v', '3 × 3 per side', 'pistol', 'Five seconds down.', 'Pause at the bottom, then rise.'],

      ['Dead bug', 'core', 0, 'm', '3 × 8 per side', 'deadbug', 'Low back pressed into the floor.', 'Lower the opposite arm and leg slowly.'],
      ['Bird-dog', 'core', 0, 'v', '3 × 8 per side', 'birddog', 'On all fours, reach one arm and the opposite leg.', 'Keep your hips level.', ['core'], ['lowback', 'glutes']],
      ['Knee plank', 'core', 0, 'v', '3 × 20 s', 'plank', 'Forearms down, knees down.', 'Straight line from head to knees.'],
      ['Plank', 'core', 1, 'm', '3 × 30 s', 'plank', 'Elbows under your shoulders.', 'Squeeze your glutes, no sagging.'],
      ['Knee side plank', 'core', 1, 'v', '3 × 20 s per side', 'sideplank', 'Elbow under shoulder, knees bent.', 'Lift your hips into a straight line.'],
      ['Tucked hollow hold', 'core', 1, 'v', '3 × 20 s', 'hollow', 'Low back pressed down.', 'Knees tucked, arms reaching forward.'],
      ['Hollow hold', 'core', 2, 'm', '3 × 20 s', 'hollow', 'Arms overhead, legs low and straight.', 'Your low back stays glued to the floor.'],
      ['Side plank', 'core', 2, 'v', '3 × 30 s per side', 'sideplank', 'Feet stacked, hips high.', 'Hold one straight line.'],
      ['Russian twist', 'core', 2, 'v', '3 × 20', 'twist', 'Lean back about 45 degrees, chest up.', 'Rotate your hands side to side.'],
      ['Plank shoulder taps', 'core', 2, 'v', '3 × 10 per side', 'shouldertap', 'High plank, feet wide.', 'Tap the opposite shoulder without rocking.', ['core', 'shoulders'], []],
      ['Woodchop', 'core', 2, 'v', '3 × 12 per side', 'woodchop', 'Hands clasped high on one side.', 'Chop down across your body and pivot the back foot.'],
      ['Tuck L-sit on chairs', 'core', 3, 'm', '3 × 10 s', 'lsit', 'Hands on two chairs, arms locked.', 'Push down and lift your tucked knees.', ['core', 'hips', 'arms'], []],
      ['Bent-knee windshield wipers', 'core', 3, 'v', '3 × 8 per side', 'wipers', 'On your back, arms out, knees up.', 'Lower both knees to one side and back.'],
      ['Hollow rocks', 'core', 3, 'v', '3 × 15', 'hollow', 'Hold the hollow shape.', 'Rock gently from shoulders to hips.'],
      ['Side plank reach-through', 'core', 3, 'v', '3 × 8 per side', 'sideplank', 'From a side plank, reach under your body.', 'Rotate back up to the start.'],
      ['L-sit', 'core', 4, 'm', '3 × 10 s', 'lsit', 'Legs straight and level.', 'Push your shoulders down hard.', ['core', 'hips', 'arms'], []],
      ['Dragon flag negative', 'core', 4, 'v', '3 × 3', 'hollow', 'Hold the bed frame behind your head.', 'Lower your straight body as one piece.'],
      ['Straight-leg windshield wipers', 'core', 4, 'v', '3 × 6 per side', 'wipers', 'Legs straight up.', 'Lower them side to side, shoulders down.'],
      ['V-up', 'core', 4, 'v', '3 × 10', 'vup', 'Start flat with arms overhead.', 'Fold up to touch your toes, then lower slowly.'],

      ['Single-leg stand', 'balance', 0, 'm', '2 × 30 s per side', 'singleleg', 'Stand tall on one foot.', 'Fix your eyes on one spot.', ['legs', 'core'], []],
      ['Eyes-closed single-leg stand', 'balance', 0, 'v', '2 × 20 s per side', 'singleleg', 'Find your balance, then close your eyes.', 'Hover a hand near a wall.', ['legs', 'core'], []],
      ['Heel-to-toe walk', 'balance', 0, 'v', '2 lengths of the room', 'march', 'Heel touches toe on every step.', 'Arms out, slow and steady.', ['legs', 'core'], []],
      ['Tiptoe balance', 'balance', 0, 'v', '3 × 20 s', 'calf', 'Rise onto your toes.', 'Hold still without wobbling.', ['legs', 'core'], []],
      ['Frog stand', 'balance', 1, 'm', '5 × 10 s', 'frogstand', 'Knees rest on the backs of your elbows.', 'Lean forward until your feet float.'],
      ['Wall plank walk', 'balance', 1, 'v', '3 × 3 steps', 'pike', 'From a plank, walk your feet a little way up the wall.', 'Walk back down with control.'],
      ['Crow pose', 'balance', 1, 'v', '5 × 10 s', 'frogstand', 'Knees high on your upper arms.', 'Look forward, not down.'],
      ['Wall handstand', 'balance', 2, 'm', '3 × 20 s', 'handstand', 'Walk your feet up, chest facing the wall.', 'Push the floor away, ears between your arms.'],
      ['Pike hold on the bed', 'balance', 2, 'v', '3 × 20 s', 'pike', 'Feet on the bed, hips high.', 'Stack your shoulders over your hands.'],
      ['Wall walk-up', 'balance', 2, 'v', '3 × 3', 'handstand', 'Walk your feet up and your hands in.', 'Walk back out and down slowly.'],
      ['Wall handstand, 60 s', 'balance', 3, 'm', '3 × 30 to 60 s', 'handstand', 'Squeeze your glutes and point your toes.', 'Breathe steadily.'],
      ['Wall shoulder taps', 'balance', 3, 'v', '3 × 6 per side', 'handstand', 'Chest to the wall in a handstand.', 'Shift and tap one shoulder at a time.'],
      ['Kick-up practice', 'balance', 3, 'v', '10 tries', 'handstand', 'Practice the cartwheel bail first.', 'Kick up lightly and find the balance point.'],
      ['Freestanding handstand', 'balance', 4, 'm', '10 attempts', 'handstand', 'Balance with your fingertips.', 'Short, frequent tries beat long ones.'],
      ['30-second freestanding hold', 'balance', 4, 'v', '5 tries', 'handstand', 'Kick up and hold the balance.', 'Work toward 30 seconds over time.'],
      ['Handstand walk', 'balance', 4, 'v', '5 tries', 'handstand', 'Lean a little so you start to fall forward.', 'Step your hands to catch it.'],

      ['March in place', 'cond', 0, 'w', '1 min', 'march', 'Knees up to hip height.', 'Swing your arms.'],
      ['Quiet fast feet', 'cond', 0, 'f', '3 × 20 s', 'jog', 'Tiny quick steps on the balls of your feet.', 'Stay light and quiet.'],
      ['Squat-to-stand speed reps', 'cond', 0, 'f', '3 × 15', 'squat', 'Fast up, controlled down.', 'Swing your arms to help.'],
      ['Step-out plank jack', 'cond', 0, 'f', '3 × 12', 'mountain', 'High plank, step one foot out, then the other.', 'Step back in, no hopping.'],
      ['Slow mountain climbers', 'cond', 0, 'w', '3 × 10 per side', 'mountain', 'High plank, hips level.', 'Bring one knee to your chest at a time.'],
      ['Shadow jog', 'cond', 0, 'w', '1 min', 'jog', 'Jog in place, landing softly.', 'Swing your arms.'],
      ['Skater steps', 'cond', 0, 'f', '3 × 10 per side', 'skater', 'Step wide to one side and reach across.', 'No jumping, just big steps.'],
      ['Burpee walk-out', 'cond', 0, 'f', '3 × 6', 'burpee', 'Hands down, walk your feet back to a plank.', 'Walk them back in and stand tall.'],

      ['Stance and jab', 'strikes', 0, 'm', '2 rounds of 1 min', 'jab', 'Lead foot forward, hands by your cheeks.', 'Snap the lead hand out and straight back.'],
      ['Guard bounce', 'strikes', 0, 'v', '2 rounds of 1 min', 'groove', 'Light bounce on the balls of your feet.', 'Hands stay up the whole time.', ['legs', 'shoulders'], []],
      ['Jab-cross', 'strikes', 0, 'v', '2 rounds of 1 min', 'jab', 'Jab, then turn your hip into the rear hand.', 'Breathe out sharply on each punch.'],
      ['Hooks and uppercuts', 'strikes', 1, 'm', '2 rounds of 1 min', 'hook', 'Hook: elbow up, turn your whole body.', 'Uppercut: dip, then drive up through your legs.'],
      ['Slip and roll', 'strikes', 1, 'v', '2 rounds of 1 min', 'bobweave', 'Slip your head off-line to one side.', 'Roll under in a U shape, hands up.', ['legs', 'core'], []],
      ['Squat to jabs', 'strikes', 1, 'v', '3 × 12', 'squat', 'Squat with your hands guarding your face.', 'Stand and throw two jabs.', ['legs', 'shoulders'], ['glutes']],
      ['Front and round kick', 'strikes', 2, 'm', '3 × 8 per side', 'frontkick', 'Lift the knee first, then extend.', 'For the round kick, pivot your standing foot.', ['hips', 'legs', 'core'], []],
      ['Knee strikes', 'strikes', 2, 'v', '2 × 20', 'knee', 'Reach forward like grabbing a shoulder.', 'Drive the knee up as your hands pull down.', ['core', 'hips'], []],
      ['Side kick', 'strikes', 2, 'v', '3 × 8 per side', 'roundkick', 'Chamber the knee toward your chest.', 'Drive the heel straight out to the side.', ['hips', 'legs'], ['glutes']],
      ['Elbow strikes', 'strikes', 2, 'v', '2 rounds of 1 min', 'hook', 'Short, sharp elbows at head height.', 'Turn your hips into each one.'],
      ['Combos with slips', 'strikes', 3, 'm', '3 rounds of 2 min', 'jab', 'Jab, cross, slip, hook.', 'Reset your stance after each combo.'],
      ['Kick-punch combo', 'strikes', 3, 'v', '3 rounds of 2 min', 'frontkick', 'Jab, cross, then a roundhouse.', 'Hands come straight back to guard.'],
      ['Low switch kick', 'strikes', 3, 'v', '3 × 8 per side', 'roundkick', 'A small step to switch stance.', 'Kick low and controlled, no jumping.'],
      ['Full 3-minute rounds', 'strikes', 4, 'm', '4 rounds of 3 min', 'jab', 'Mix punches, kicks and slips.', 'Rest 1 minute between rounds.'],
      ['Flurry finisher', 'strikes', 4, 'v', '4 × 30 s', 'jab', 'All-out fast punches for 30 seconds.', 'Stay light on your feet.'],

      ['Bounce and rock', 'dance', 0, 'm', '2 rounds of 1 min', 'groove', 'Bend your knees to the beat.', 'Let your chest rock forward and back.'],
      ['Two-step', 'dance', 0, 'v', '2 rounds of 1 min', 'groove', 'Step side to side, tapping your feet together.', 'Add arm swings once it feels easy.'],
      ['Shoulder isolations', 'dance', 0, 'v', '2 × 30 s', 'groove', 'Keep your hips still.', 'Pop one shoulder up at a time.', ['shoulders'], ['shoulders']],
      ['Body roll', 'dance', 0, 'v', '2 × 8', 'groove', 'Lead with your chest, then belly, then hips.', 'Slow and smooth.', ['core'], ['back']],
      ['Indian step', 'dance', 1, 'm', '2 rounds of 1 min', 'indianstep', 'Kick one foot forward and cross it back.', 'Bounce, arms loose.'],
      ['Cross step', 'dance', 1, 'v', '2 rounds of 1 min', 'indianstep', 'Cross one foot over the other.', 'Open back out with a bounce.'],
      ['Salsa rock', 'dance', 1, 'v', '2 rounds of 1 min', 'indianstep', 'Rock one foot forward and back.', 'Swing your arms across your body.'],
      ['Low-impact running man', 'dance', 1, 'v', '2 × 30 s', 'march', 'Slide one foot back as the other knee lifts.', 'Keep it low and quiet.'],
      ['Six-step', 'dance', 2, 'm', '5 slow rounds', 'sixstep', 'Hands on the floor, step your feet around in a circle.', 'Six steps around and back to the start.', ['shoulders', 'arms', 'core', 'legs'], []],
      ['Three-step', 'dance', 2, 'v', '5 slow rounds', 'sixstep', 'A shorter circle of three steps.', 'Stay low with your hands planted.', ['shoulders', 'arms', 'core', 'legs'], []],
      ['Kick-outs', 'dance', 2, 'v', '3 × 8', 'sixstep', 'From a crouch, shoot both legs out.', 'Hop them back in, hands planted.', ['shoulders', 'core', 'legs'], []],
      ['Controlled go-down', 'dance', 2, 'v', '6 tries', 'squat', 'From standing, sink into a crouch.', 'Your hands catch you, no dropping.'],
      ['Baby freeze', 'dance', 3, 'm', '5 tries, hold 3 s', 'freeze', 'Tuck one elbow into your side, the other against your knee.', 'Lean until your head touches lightly, then lift your feet.', ['shoulders', 'arms', 'core'], []],
      ['CC footwork', 'dance', 3, 'v', '4 rounds', 'sixstep', 'Swing one leg through under your body.', 'Switch sides with a little hop of the hands.', ['shoulders', 'core', 'legs'], []],
      ['Footwork into baby freeze', 'dance', 3, 'v', '4 tries', 'freeze', 'Do one six-step.', 'Drop straight into the freeze.', ['shoulders', 'arms', 'core'], []],
      ['Chair freeze', 'dance', 4, 'm', '5 tries, hold 3 s', 'freeze', 'Elbow into your lower back, other hand on the floor.', 'Cross your legs into a seated shape in the air.', ['shoulders', 'arms', 'core'], []],
      ['Toprock-to-floor transition', 'dance', 4, 'v', '4 tries', 'squat', 'Toprock for 8 counts.', 'Drop into footwork without stopping.'],

      ['Joint circles', 'mobility', 0, 'm', '5 each way per joint', 'jointcircles', 'Neck, shoulders, wrists, hips, ankles.', 'Slow, controlled circles.', ['shoulders', 'hips'], ['shoulders']],
      ['Arm circles', 'mobility', 0, 'v', '30 s each way', 'jointcircles', 'Arms straight out to the sides.', 'Small circles that grow bigger, then reverse.', ['shoulders'], ['shoulders']],
      ['Hip circles', 'mobility', 0, 'v', '5 each way', 'hipcircle', 'Hands on hips, feet planted.', 'Draw big slow circles with your pelvis.', ['hips'], ['glutes', 'lowback']],
      ['Ankle rocks', 'mobility', 0, 'v', '10 per side', 'lowlunge', 'Half-kneel facing a wall.', 'Drive the front knee toward the wall, heel down.', ['legs'], []],
      ['90/90 hip switches', 'mobility', 1, 'm', '8 per side', 'hip9090', 'Sit with both knees bent at 90 degrees.', 'Rotate both knees to the other side.', ['hips'], ['glutes']],
      ['Cat-cow', 'mobility', 1, 'v', '10 slow', 'catcow', 'On all fours, round your back up.', 'Then let your belly drop and look up.', ['core'], ['back', 'lowback']],
      ['Open book', 'mobility', 1, 'v', '8 per side', 'twistlie', 'Lie on your side, knees bent, arms together.', 'Open the top arm across and follow it with your eyes.', ['chest'], ['back']],
      ['Towel pass-through', 'mobility', 1, 'v', '10', 'jointcircles', 'Hold a towel wide, arms straight.', 'Lift it over your head and behind you.', ['shoulders', 'chest'], ['shoulders']],
      ['Deep squat sit', 'mobility', 2, 'm', '1 min', 'deepsquat', 'Sink into your deepest squat, heels down.', 'Elbows push your knees out.', ['hips', 'legs'], ['glutes']],
      ["World's greatest stretch", 'mobility', 2, 'v', '3 per side', 'lowlunge', 'Long lunge, hand inside your front foot.', 'Rotate and reach the other arm up.', ['hips', 'legs', 'core'], ['hamstrings', 'back']],
      ['Spine waves', 'mobility', 2, 'v', '8 slow', 'fold', 'Roll down one vertebra at a time.', 'Roll back up from the bottom.', ['core'], ['back', 'lowback']],
      ['Wrist prep circuit', 'mobility', 2, 'v', '1 min', 'catcow', 'On all fours, rock gently over your hands.', 'Turn your fingers sideways, then back, and rock again.', ['arms'], ['arms']],
      ['Deep squat with rotations', 'mobility', 3, 'm', '2 min', 'deepsquat', 'Sit in a deep squat.', 'Reach one arm up and rotate, then switch.', ['hips', 'legs', 'core'], ['back', 'glutes']],
      ['Jefferson curl', 'mobility', 3, 'v', '2 × 6 slow', 'fold', 'Stand tall and tuck your chin.', 'Curl down one vertebra at a time, then roll up.', [], ['back', 'lowback', 'hamstrings']],
      ['Wall walk-down', 'mobility', 3, 'v', '3 tries', 'bridge', 'Back to a wall, reach overhead.', 'Walk your hands down the wall toward a bridge.', ['shoulders', 'chest', 'hips'], ['back']],
      ['Bridge', 'mobility', 4, 'm', '3 × 10 s', 'bridge', 'Hands by your ears, feet flat.', 'Push up into an arch.', ['shoulders', 'chest', 'hips'], ['back', 'glutes']],
      ['No-hands 90/90 transitions', 'mobility', 4, 'v', '8 per side', 'hip9090', 'Sit tall in a 90/90.', 'Switch sides without using your hands.', ['hips', 'core'], ['glutes']],

      ['Toe reach', 'stretch', 0, 'm', '45 s', 'fold', 'Soft knees, hinge at your hips.', 'Let your hands hang toward your toes.', [], ['hamstrings', 'lowback']],
      ['Low lunge', 'stretch', 1, 'm', '45 s per side', 'lowlunge', 'Back knee down on something soft.', 'Sink your hips forward, chest tall.', ['hips', 'legs'], []],
      ['Pigeon pose', 'stretch', 2, 'm', '45 s per side', 'pigeon', 'Front shin across, back leg long behind you.', 'Fold forward only as far as feels good.', ['hips'], ['glutes']],
      ['Half splits', 'stretch', 3, 'm', '45 s per side', 'halfsplit', 'Back knee down, front leg straight.', 'Hinge forward over the front leg, back flat.', [], ['hamstrings']],
      ['Pancake', 'stretch', 4, 'm', '60 s', 'seatedfold', 'Sit in a wide straddle.', 'Hinge forward from your hips, chest toward the floor.', ['hips', 'legs'], ['hamstrings', 'lowback']],
      ['Lizard', 'stretch', 2, 'v', '45 s per side', 'lowlunge', 'Low lunge with both hands inside the front foot.', 'Lower onto your forearms if it feels good.', ['hips', 'legs'], []],
      ['Butterfly', 'stretch', 0, 'v', '45 s', 'butterfly', 'Soles together, knees falling out.', 'Sit tall and hinge forward gently.', ['hips', 'legs'], []],
      ['Frog stretch', 'stretch', 2, 'v', '45 s', 'childpose', 'On all fours, slide your knees wide.', 'Ease your hips back toward your heels.', ['hips', 'legs'], []],
      ['Happy baby', 'stretch', 1, 'v', '45 s', 'happybaby', 'On your back, hold your feet, knees wide.', 'Rock gently side to side.', ['hips'], ['lowback']],
      ['Standing fold', 'stretch', 0, 'v', '45 s', 'fold', 'Feet hip width, knees soft.', 'Let your head and arms hang.', [], ['hamstrings', 'lowback']],
      ['Seated forward fold', 'stretch', 1, 'v', '45 s', 'seatedfold', 'Legs straight out in front.', 'Reach forward with a long back.', [], ['hamstrings', 'lowback']],
      ['Lying towel stretch', 'stretch', 0, 'v', '30 s per side', 'legup', 'On your back, loop a towel around one foot.', 'Raise the straight leg until you feel a stretch.', [], ['hamstrings']],
      ['Downward dog', 'stretch', 1, 'v', '45 s', 'pike', 'Hips high, hands and feet planted.', 'Press your chest toward your thighs.', ['shoulders'], ['hamstrings', 'back']],
      ["Child's pose", 'stretch', 0, 'v', '60 s', 'childpose', 'Knees wide, sit back toward your heels.', 'Reach your arms long and breathe slowly.', [], ['back', 'lowback', 'shoulders']],
      ['Lying twist', 'stretch', 0, 'v', '30 s per side', 'twistlie', 'On your back, drop both knees to one side.', 'Arms wide, shoulders stay down.', ['core'], ['lowback', 'back']],
      ['Cobra', 'stretch', 1, 'v', '30 s', 'cobra', 'Lie face down, hands under your shoulders.', 'Press your chest up, hips stay down.', ['core', 'chest'], ['lowback']],
      ['Sphinx', 'stretch', 0, 'v', '45 s', 'cobra', 'Lie face down on your forearms.', 'Lift your chest and relax your lower back.', ['core'], ['lowback']],
      ['Thread the needle', 'stretch', 1, 'v', '30 s per side', 'catcow', 'On all fours, slide one arm under your body.', 'Rest your shoulder and ear on the floor.', ['shoulders'], ['back', 'shoulders']],
      ['Doorway chest stretch', 'stretch', 0, 'v', '30 s per side', 'armstretch', 'Forearm on a door frame at shoulder height.', 'Step through until your chest opens.', ['chest', 'shoulders'], []],
      ['Cross-body shoulder stretch', 'stretch', 0, 'v', '30 s per side', 'armstretch', 'Pull one arm across your chest.', 'Keep that shoulder down.', ['shoulders'], ['shoulders', 'back']],
      ['Overhead triceps stretch', 'stretch', 0, 'v', '30 s per side', 'armstretch', 'Hand behind your head, other hand on the elbow.', 'Stand tall and breathe.', ['arms'], ['arms']],
      ['Puppy pose', 'stretch', 1, 'v', '45 s', 'childpose', 'On all fours, walk your hands forward.', 'Melt your chest toward the floor, hips high.', ['shoulders', 'chest'], ['back']],
      ['Standing quad stretch', 'stretch', 0, 'v', '30 s per side', 'quad', 'Hold your ankle behind you.', 'Knees together, hips pushed slightly forward.', ['legs', 'hips'], []],
      ['Wall calf stretch', 'stretch', 0, 'v', '30 s per side', 'calfwall', 'Back leg straight, heel down.', 'Lean into the wall.', [], ['hamstrings']],
      ['Kneeling shin stretch', 'stretch', 1, 'v', '30 s', 'kneel', 'Kneel with the tops of your feet flat.', 'Sit back toward your heels.', ['legs'], []],

      ['Tripod headstand', 'freezes', 0, 'm', '5 × 10 s', 'headstand', 'Head and hands make a triangle on a soft surface.', 'Walk your feet in and lift your knees onto your elbows.'],
      ['Elbow freeze', 'freezes', 1, 'm', '5 tries, hold 3 s', 'freeze', 'Plant one elbow into your hip.', 'Balance your body sideways on that arm.'],
      ['Turtle freeze', 'freezes', 2, 'm', '5 tries, hold 3 s', 'freeze', 'Both elbows tucked into your stomach.', 'Lean forward and lift both feet.'],
      ['Headstand freeze', 'freezes', 3, 'm', '5 tries, hold 3 s', 'headstand', 'From a tripod headstand, lift your legs.', 'Freeze them in a fun shape.'],
      ['Freeze chains', 'freezes', 4, 'm', '4 tries', 'freeze', 'Link two or three freezes.', 'Move through footwork between them.'],
      ['Lizard hold, 60 s', 'splits', 0, 'm', '60 s per side', 'lowlunge', 'Low lunge, both hands inside the front foot.', 'Breathe and sink a little deeper.'],
      ['Front-split slide', 'splits', 1, 'm', '45 s per side', 'split', 'Hands on books on both sides.', 'Slide the front heel forward a little at a time.'],
      ['Front split, hands on books', 'splits', 2, 'm', '45 s per side', 'split', 'Lower as far as is comfortable.', 'Hips stay square to the front.'],
      ['Side-split prep', 'splits', 3, 'm', '45 s', 'cossack', 'Wide horse stance, hands on the floor.', 'Slide your feet wider bit by bit.'],
      ['Full front split', 'splits', 4, 'm', '30 s per side', 'split', 'Warm up first with lunges.', 'Settle all the way down only when it feels easy.'],
      ['Bear hold', 'crawls', 0, 'm', '3 × 20 s', 'bear', 'On all fours, lift your knees an inch.', 'Back flat, hold still.'],
      ['Bear crawl', 'crawls', 1, 'm', '3 lengths of the room', 'bear', 'Knees hover just off the floor.', 'Move opposite hand and foot together.'],
      ['Crab walk', 'crawls', 2, 'm', '3 lengths of the room', 'crab', 'Sit, hands behind you, lift your hips.', 'Walk forward and back with hips high.'],
      ['Lateral bear crawl', 'crawls', 3, 'm', '3 lengths each way', 'bear', 'Bear position, move sideways.', 'Keep your hips low and level.'],
      ['Crawl flow', 'crawls', 4, 'm', '3 rounds of 1 min', 'crab', 'Move from bear to crab and back.', 'Smooth transitions, no stopping.'],
      ['Bouncing stance', 'flow', 0, 'm', '2 rounds of 1 min', 'groove', 'Light bounce, hands up.', 'Shift your weight front to back.'],
      ['Bob and weave', 'flow', 1, 'm', '2 rounds of 1 min', 'bobweave', 'Bend your knees to duck under.', 'Come up on the other side.'],
      ['Angle steps', 'flow', 2, 'm', '2 rounds of 1 min', 'skater', 'Pivot on your front foot.', 'Step out to a new angle and reset.'],
      ['Footwork with combos', 'flow', 3, 'm', '3 rounds of 2 min', 'jab', 'Move, then throw a combo.', 'Move again right after.'],
      ['3-minute flow round', 'flow', 4, 'm', '3 rounds of 3 min', 'bobweave', 'Footwork, punches, slips and kicks.', 'Keep moving the whole round.']
    ];
  }
  animRows() {
    const S = 'H50,14 N50,23 P50,49 E48,36 W47,48 K48,69 F47,89 e52,36 w53,48 k52,69 f53,89';
    const FR = 'H50,14 N50,23 P50,49 K46,69 F44,89 k54,69 f56,89';
    const JA = 'H49,15 N48,24 P47,49 E56,33 W57,22 K54,68 F58,89 e44,34 w48,22 k42,68 f37,89';
    const PU = 'H19,57 N26,61 P55,73 E26,75 W26,89 K72,81 F88,88 e29,75 w29,89 k72,80 f88,87';
    const BD = 'H22,58 N28,62 P58,62 E28,75 W28,89 K58,89 F72,89 e30,75 w30,89 k60,89 f74,89';
    const YT = 'H18,84 N26,85 P55,86 E14,86 W5,85 K72,87 F88,87 e16,86 w7,85 k72,87 f88,87';
    const LY = 'H12,84 N20,85 P46,86 E30,88 W40,88';
    const FS = 'H30,66 N36,62 P56,50 E38,76 W38,89 K44,70 F60,89 e40,76 w40,89 k46,70 f62,89';
    const SQB = 'H48,42 N49,50 P40,70 E58,50 W68,50 K58,72 F50,89 e58,51 w68,51 k60,72 f54,89';
    return {
      stand: [S, 'H50,15 N50,24', 3],
      wallpush: ['H36,22 N41,30 P53,57 E31,31 W20,32 K57,73 F61,89 e33,32 w21,34 k59,73 f63,89', 'H30,26 N35,33 P51,59 E30,40 e32,41', 2.4, { wall: 18 }],
      incline: ['H21,32 N28,37 P56,61 E28,49 W27,60 K71,75 F86,89 e30,49 w29,60 k72,75 f87,89', 'H23,43 N30,48 P57,67 E37,53 e39,53 K72,78 k73,78', 2.2, { box: [6, 60, 24, 30] }],
      kneepush: ['H19,59 N26,62 P52,74 E26,75 W26,89 K70,88 F86,80 e29,75 w29,89 k72,88 f88,80', 'H21,76 N28,79 P54,82 E35,81 e37,81', 2.2],
      pushup: [PU, 'H21,76 N28,79 P56,82 E35,80 e37,80 K72,85 k72,85', 2.2],
      decline: ['H19,62 N26,64 P55,60 E26,76 W26,89 K71,58 F86,56 e29,76 w29,89 k71,57 f86,55', 'H21,80 N28,80 P56,66 E35,82 e37,82 K72,60 k72,60', 2.2, { box: [72, 58, 24, 32] }],
      dip: ['H31,30 N29,38 P34,62 E28,49 W27,60 K58,64 F60,89 e30,49 w29,60 k60,64 f62,89', 'H33,42 N31,50 P33,72 E20,52 e22,52 K58,68 k60,68', 2.2, { box: [4, 60, 26, 30] }],
      pike: ['H27,66 N31,58 P52,32 E28,73 W24,89 K64,60 F76,89 e30,73 w26,89 k66,60 f78,89', 'H22,81 N28,71 P50,38 E34,79 e36,79', 2.4],
      handstand: ['H50,72 N50,63 P51,38 E50,76 W50,89 K52,22 F53,7 e52,76 w52,89 k54,22 f55,7', 'H50,70 N50,61 P52,37 K53,21 F55,6 k55,21 f57,6', 3, { wall: 60 }],
      ytw: [YT, 'H17,81 N26,84 E15,79 W7,72 e17,79 w9,72', 2.4],
      superman: [YT, 'H17,80 N26,83 E15,78 W6,74 e17,78 w8,74 K72,83 F88,78 k72,83 f88,78', 2.4],
      pullapart: [FR + ' E44,32 W48,34 e56,32 w52,34', 'E36,28 W26,30 e64,28 w74,30', 2.2],
      row: ['H22,64 N29,66 P58,77 E30,56 W30,47 K74,83 F88,89 e32,56 w32,47 k74,83 f88,89', 'H24,52 N31,54 P60,70 E42,50 e44,50 K75,79 k75,79', 2, { bar: [10, 50, 46] }],
      chairsquat: [S + ' E57,34 W67,34 e57,35 w67,35', 'H52,40 N50,48 P36,66 E58,48 W68,48 e58,49 w68,49 K56,70 F48,89 k58,70 f52,89', 2.6, { box: [20, 66, 20, 24] }],
      squat: [S + ' E57,34 W67,34 e57,35 w67,35', SQB, 2.4],
      wallsit: ['H33,34 N33,43 P33,64 E40,52 W46,58 K54,64 F54,89 e42,52 w48,58 k56,64 f56,89', 'H33,35 N33,44', 3, { wall: 26 }],
      glutebridge: [LY + ' K60,70 F70,89 e30,88 w40,88 k62,70 f72,89 P46,86', 'P46,72 K60,66 k62,66', 2.2],
      calf: [S, 'H50,10 N50,19 P50,45 E48,32 W47,44 K48,66 e52,32 w53,44 k52,66', 1.6],
      lunge: ['H50,14 N50,23 P50,48 E48,35 W47,47 K56,68 F58,89 e52,35 w53,47 k44,68 f38,89', 'H50,30 N50,39 P48,63 E47,51 W46,62 K62,70 F60,89 e51,51 w52,62 k40,86 f26,88', 2.4],
      bulgarian: ['H52,16 N52,25 P50,50 E50,37 W49,49 K60,68 F60,89 e54,37 w55,49 k40,66 f22,70', 'H52,30 N52,39 P46,64 E50,51 W49,62 K64,70 e54,51 w55,62 k36,82', 2.6, { box: [12, 70, 22, 20] }],
      cossack: ['H50,26 N50,35 P50,60 E44,46 W48,56 K34,70 F26,89 e56,46 w52,56 k66,70 f74,89', 'H36,38 N38,47 P34,74 E40,58 W46,64 K24,74 e44,58 w50,64 k60,80 f78,86', 2.8],
      pistol: [S + ' E56,32 W66,32 e56,33 w66,33 k58,60 f70,62', 'H56,52 N55,60 P44,78 E64,62 W74,62 K58,76 F50,89 e64,63 w74,63 k66,82 f84,82', 3],
      rdl: ['H50,14 N50,23 P52,49 E50,36 W50,48 K52,69 F52,89 e54,36 w54,48 k56,68 f58,88', 'H24,40 N32,42 P54,48 E33,52 W33,62 K54,69 F54,89 e35,52 w35,62 k70,46 f86,44', 2.8],
      nordic: ['H50,32 N50,40 P50,64 E50,50 W50,58 K50,88 F28,88 e52,50 w52,58 k52,88 f30,88', 'H38,38 N41,45 P47,65 E43,54 W44,62 e45,54 w46,62', 2.8],
      deadbug: [LY + ' E22,72 W22,62 K46,70 F58,70 e24,72 w24,62 k48,70 f60,70 H12,82 N20,82 P46,84', 'E12,74 W4,70 K56,78 F72,82', 2.4],
      birddog: [BD, 'E18,60 W8,58 K72,62 F88,62', 2.4],
      plank: ['H20,70 N28,73 P56,75 E28,88 W16,88 K72,81 F88,88 e30,88 w18,88 k72,81 f88,88', 'H20,69 N28,72 P56,73', 3],
      sideplank: ['H22,62 N28,66 P56,76 E28,80 W28,89 K72,82 F88,88 e36,60 w42,52 k72,82 f88,88', 'P56,70 e34,56 w38,46', 2.6],
      hollow: ['H16,80 N24,82 P50,86 E14,78 W4,74 K68,82 F86,78 e16,78 w6,74 k68,82 f86,78', 'H16,76 N24,80 K68,84 F86,82 k68,84 f86,82', 1.8],
      twist: ['H38,46 N41,54 P52,82 E50,64 W60,66 K66,70 F78,82 e52,64 w62,66 k66,70 f78,82', 'H36,46 E34,64 W26,68 e36,64 w28,68', 1.6],
      shouldertap: [PU, 'E30,72 W27,64', 1.8],
      woodchop: [FR + ' E60,16 W68,8 e60,18 w66,10', 'H46,22 N47,30 E40,44 W32,56 e42,46 w34,58 K42,72 k54,72', 1.8],
      lsit: ['H40,30 N40,39 P42,60 E40,50 W40,62 K56,58 F70,60 e42,50 w42,62 k56,58 f70,60', 'K56,56 F70,56 k56,56 f70,56', 3, { box: [26, 62, 40, 28] }],
      wipers: [LY + ' e30,88 w40,88 P46,86 K48,66 F50,48 k50,66 f52,48', 'K56,70 F68,58 k58,70 f70,58', 2.4],
      vup: [LY + ' P48,86 E10,84 W2,84 K68,86 F86,86 e10,84 w2,84 k68,86 f86,86', 'H34,62 N38,70 P50,84 E46,60 W58,52 K62,66 F70,52 e46,60 w58,52 k62,66 f70,52', 2],
      singleleg: ['H50,14 N50,23 P50,49 E40,34 W32,40 K49,69 F49,89 e60,34 w68,40 k58,58 f54,72', 'H51,14 N51,23', 3],
      march: [S, 'K56,58 F54,74 E44,36 W40,44 e58,38 w64,44', 1.2],
      jog: [S + ' E52,38 W58,32 e46,38 w40,32', 'K56,58 F54,72 E44,36 W40,30 e56,38 w62,30', 0.6],
      frogstand: [FS, 'H27,72 N34,66 P54,52 K42,72 F62,76 k44,72 f64,76', 2.6],
      mountain: [PU, 'P54,70 K44,78 F50,86', 1],
      skater: [FR + ' E44,36 W40,46 e56,36 w60,46', 'H40,22 N41,31 P42,54 E34,40 W30,50 e50,40 w58,46 K34,70 F30,89 k54,72 f62,86', 1.6],
      burpee: [S, PU, 2.4],
      jab: [JA, 'E64,24 W76,22', 1],
      groove: [S, 'H50,18 N50,27 P50,53 K54,70 k56,70 E46,40 e54,40', 0.8],
      hook: [JA, 'H50,16 N50,25 E62,26 W58,20', 1.2],
      bobweave: [JA, 'H54,32 N52,40 P48,58 E58,46 W58,36 e48,46 w52,36 K56,72 k42,72', 1.6],
      frontkick: [JA, 'H44,16 N44,25 P46,50 K60,54 F80,48', 1.4],
      knee: [JA, 'K58,46 F54,64 E60,44 W58,50', 1.2],
      roundkick: [JA, 'H42,18 N43,27 P47,50 K62,46 F82,40 E38,32 W32,36', 1.4],
      indianstep: [S, 'F64,84 K58,70 E42,36 W36,44 e58,36 w62,42', 0.9],
      sixstep: ['H36,54 N40,60 P52,66 E38,74 W36,89 K64,72 F70,89 e40,74 w38,89 k44,80 f56,89', 'K56,78 F42,89 k66,74 f78,88', 1.4],
      freeze: [FS, 'H36,84 N42,76 P58,58 E46,74 W44,89 K62,62 F76,56 e48,74 w46,89 k64,64 f78,60', 2.6],
      jointcircles: [FR + ' E38,25 W28,25 e62,25 w72,25', 'E42,15 W40,5 e58,15 w60,5', 2],
      hipcircle: [FR + ' E42,40 W46,48 e58,40 w54,48', 'H47,14 N48,23 P55,48 E44,40 W50,47 e60,40 w58,47', 1.6],
      lowlunge: ['H50,32 N50,40 P50,64 E50,52 W52,62 K64,70 F64,89 e52,52 w54,62 k40,86 f26,88', 'H54,38 N53,46 P53,70 E57,58 W60,66 e59,58 w62,66 K67,72', 3],
      hip9090: ['H40,40 N42,48 P46,78 E50,60 W56,70 K60,70 F66,86 e38,60 w34,72 k30,74 f28,86', 'H52,40 N50,48 K34,70 F28,86 k60,74 f66,86', 2.4],
      catcow: [BD + ' H24,70 N28,62', 'H20,54 N28,64 P58,64', 3],
      twistlie: [LY + ' e30,88 w40,88 P46,86 K58,70 F66,86 k60,70 f68,86', 'K64,80 F70,88 k66,80 f72,88', 3],
      deepsquat: [SQB, 'H48,44 N49,52', 3],
      fold: [S, 'H56,64 N54,56 P50,48 E58,66 W56,78 e60,66 w58,78', 3],
      bridge: [LY + ' E18,78 W20,89 e20,78 w22,89 P46,86 K60,70 F70,89 k62,70 f72,89 H14,84 N22,85', 'H22,76 N26,66 P50,48 E22,78 W20,89 K66,64 F70,89 e24,78 w22,89 k68,64 f72,89', 3],
      pigeon: ['H44,40 N44,48 P44,80 E46,62 W48,76 K60,84 F48,88 e42,62 w40,76 k30,86 f10,88', 'H64,74 N56,72 E66,80 W76,86 e64,80 w74,86', 3.4],
      halfsplit: ['H44,34 N44,42 P44,66 E44,54 W44,64 K44,88 F30,88 e46,54 w46,64 k60,80 f78,88', 'H62,58 N56,56 E60,70 W64,80 e62,70 w66,80', 3],
      seatedfold: ['H28,50 N30,58 P30,84 E40,66 W48,72 K50,84 F70,84 e40,66 w48,72 k50,84 f70,84', 'H50,70 N44,72 E56,78 W66,82 e56,78 w66,82', 3.4],
      butterfly: ['H50,44 N50,52 P50,82 E44,66 W48,82 K34,74 F48,86 e56,66 w52,82 k66,74 f52,86', 'H50,48 N50,56 K30,82 k70,82', 2.4],
      happybaby: [LY + ' E36,72 W44,60 e38,72 w46,60 P46,86 K42,66 F46,54 k50,66 f54,54', 'P46,84 K40,68 k52,68', 2.6],
      legup: [LY + ' E34,76 W44,66 e36,76 w46,66 P46,86 K60,80 F76,88 k62,86 f78,88', 'K54,66 F58,46 W56,52 E40,70', 3],
      childpose: ['H50,40 N50,48 P52,76 E50,60 W50,72 K66,88 F46,88 e52,60 w52,72 k68,88 f48,88', 'H78,82 N70,78 P50,78 E82,84 W92,86 e82,84 w92,86', 3],
      cobra: [YT, 'H18,64 N24,70 E24,80 W20,89 e26,80 w22,89', 3],
      armstretch: [FR + ' E42,36 W40,46 e58,36 w60,46', 'E56,28 W64,26 e48,30 w56,28', 3],
      quad: [S + ' w44,52 k48,70 f40,58', 'H50,13 N50,22', 3],
      calfwall: ['H34,22 N38,30 P50,56 E30,30 W20,30 K58,72 F64,89 e32,30 w21,30 k44,72 f44,89', 'H30,24 N35,32 P48,58', 3, { wall: 18 }],
      kneel: ['H52,32 N52,40 P52,64 E52,50 W52,60 K52,88 F30,88 e54,50 w54,60 k54,88 f32,88', 'H50,38 N50,46 P46,70', 3],
      headstand: ['H44,84 N45,76 P50,52 E36,80 W34,89 K40,64 F54,72 e38,80 w36,89 k42,64 f56,72', 'P50,48 K50,30 F51,12 k52,30 f53,12', 3],
      split: ['H50,38 N50,46 P50,72 E44,60 W40,80 K66,82 F78,86 e56,60 w60,80 k36,82 f22,88', 'H50,48 N50,56 P50,82 E42,68 W38,86 K68,88 F88,88 k32,88 f12,88', 3.4],
      bear: ['H24,58 N30,62 P60,60 E30,75 W30,89 K62,76 F72,89 e32,75 w32,89 k58,76 f68,89', 'E36,75 W38,89 K56,76 F66,89 e28,75 w26,89 k62,76 f74,89', 1.2],
      crab: ['H70,52 N64,58 P40,64 E66,74 W68,89 K28,70 F22,89 e64,74 w66,89 k30,70 f24,89', 'E62,74 W60,89 K32,70 F28,89', 1.2]
    };
  }
  hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973; return h; }
  fams() {
    if (this._F) return this._F;
    const F = {
      push: { name: 'Push', color: '#E5282E', ink: '#FFFFFF', shape: 'circle', f: ['chest', 'shoulders', 'arms'], b: ['arms'] },
      pull: { name: 'Pull', color: '#1556C2', ink: '#FFFFFF', shape: 'half', f: ['arms'], b: ['back', 'shoulders', 'arms'] },
      legs: { name: 'Legs', color: '#F26A0F', ink: '#161616', shape: 'square', f: ['legs', 'hips'], b: ['glutes', 'hamstrings'] },
      core: { name: 'Core', color: '#0B7A3E', ink: '#FFFFFF', shape: 'ring', f: ['core'], b: ['lowback'] },
      balance: { name: 'Balance', color: '#6B3FA0', ink: '#FFFFFF', shape: 'diamond', f: ['shoulders', 'arms', 'core'], b: ['shoulders'] },
      dance: { name: 'Dance', color: '#FFC20E', ink: '#161616', shape: 'quarter', f: ['legs', 'core'], b: ['glutes'] },
      strikes: { name: 'Strikes', color: '#161616', ink: '#FFFFFF', shape: 'tri', f: ['shoulders', 'core'], b: ['back'] },
      stretch: { name: 'Stretch & yoga', color: '#F6A5A9', ink: '#161616', shape: 'arch', f: ['hips'], b: ['hamstrings', 'lowback'] },
      mobility: { name: 'Mobility', color: '#0E8178', ink: '#FFFFFF', shape: 'pill', f: ['hips'], b: ['back'] },
      cond: { name: 'Conditioning', color: '#C08A00', ink: '#161616', shape: 'square', f: ['legs', 'core'], b: ['glutes'] },
      freezes: { name: 'Freezes', color: '#A2332B', ink: '#FFFFFF', shape: 'cross', hidden: true, parents: ['balance', 'dance'], f: ['shoulders', 'arms', 'core'], b: ['shoulders'] },
      splits: { name: 'Splits', color: '#9B7FD1', ink: '#161616', shape: 'semi', hidden: true, parents: ['stretch', 'mobility'], f: ['hips', 'legs'], b: ['hamstrings'] },
      crawls: { name: 'Crawls & travel', color: '#6E7B1E', ink: '#FFFFFF', shape: 'peak', hidden: true, parents: ['core', 'legs'], f: ['shoulders', 'core', 'legs'], b: ['glutes'] },
      flow: { name: 'Flow footwork', color: '#3FA7E0', ink: '#161616', shape: 'dot', hidden: true, parents: ['strikes', 'dance'], f: ['legs', 'core'], b: ['glutes'] }
    };
    const B = this.bank();
    Object.keys(F).forEach((k) => { F[k].steps = [0, 1, 2, 3, 4].map((l) => { const m = B.find((x) => x.fam === k && x.lvl === l && x.role === 'm'); return m ? m.n : ''; }); });
    this._F = F;
    return F;
  }
  bank() {
    if (this._B) return this._B;
    this._B = this.bankRows().map((r) => ({ n: r[0], fam: r[1], lvl: r[2], role: r[3], rx: r[4], anim: r[5], cues: [r[6], r[7]], f: r[8], b: r[9] }));
    return this._B;
  }
  moveInfo() {
    if (this._MI) return this._MI;
    const F = this.fams(), MI = {};
    this.bank().forEach((m) => { MI[m.n] = Object.assign({}, m, { f: m.f || F[m.fam].f, b: m.b || F[m.fam].b }); });
    this._MI = MI;
    return MI;
  }
  unlocked(levels) {
    const F = this.fams(), U = {};
    Object.keys(F).forEach((k) => { if (F[k].hidden) { const p = F[k].parents; if ((levels[p[0]] || 0) >= 2 && (levels[p[1]] || 0) >= 2) U[k] = true; } });
    return U;
  }
  figure(name, calm) {
    const MI = this.moveInfo(), A = this.animRows(), F = this.fams();
    const m = MI[name];
    const an = A[(m && m.anim) || 'stand'] || A.stand;
    const parse = (str) => { const o = {}; str.trim().split(/\s+/).forEach((tok) => { const xy = tok.slice(1).split(',').map(Number); o[tok[0]] = xy; }); return o; };
    const pa = parse(an[0]), pb = parse(an[1]);
    const derive = (o, explicit) => {
      const map = { e: 'E', w: 'W', k: 'K', f: 'F' }, off = { e: [2.5, 0], w: [2.5, 0], k: [1.5, -1], f: [1.5, -1] };
      Object.keys(map).forEach((fk) => { if (!explicit[fk]) o[fk] = [o[map[fk]][0] + off[fk][0], o[map[fk]][1] + off[fk][1]]; });
      return o;
    };
    const a = derive(Object.assign({}, pa), pa);
    const b = derive(Object.assign({}, a, pb), Object.assign({}, pa, pb));
    const torso = m ? F[m.fam].color : '#E5282E';
    const SEG = [['P', 'k'], ['k', 'f'], ['N', 'e'], ['e', 'w'], ['N', 'P'], ['H', 'N'], ['P', 'K'], ['K', 'F'], ['N', 'E'], ['E', 'W']];
    const vals = (x, y) => calm ? x + ';' + x + ';' + x : x + ';' + y + ';' + x;
    const out = { dur: an[2] + 's', aria: 'Figure demonstrating ' + name };
    SEG.forEach(([p, q], i) => {
      out['s' + i] = {
        x1: a[p][0], y1: a[p][1], x2: a[q][0], y2: a[q][1],
        ax1: vals(a[p][0], b[p][0]), ay1: vals(a[p][1], b[p][1]), ax2: vals(a[q][0], b[q][0]), ay2: vals(a[q][1], b[q][1]),
        c: i < 4 ? '#C4C4C4' : i === 4 ? torso : '#161616',
        w: i < 4 ? 5.5 : i === 4 ? 10 : i === 5 ? 5 : 6
      };
    });
    out.hx = a.H[0]; out.hy = a.H[1]; out.ahx = vals(a.H[0], b.H[0]); out.ahy = vals(a.H[1], b.H[1]);
    const pr = an[3] || {};
    out.wx = pr.wall || -20; out.wo = pr.wall ? 1 : 0;
    const bx = pr.box || [-50, -50, 1, 1]; out.bx = bx[0]; out.by = bx[1]; out.bw = bx[2]; out.bh = bx[3]; out.bo = pr.box ? 1 : 0;
    const br = pr.bar || [-20, -10, -20]; out.rx1 = br[0]; out.rx2 = br[1]; out.ry = br[2]; out.ro = pr.bar ? 1 : 0;
    return out;
  }
  shp(kind, color, z) {
    const base = 'display:block;flex:none;width:' + z + 'px;height:' + z + 'px;';
    if (kind === 'circle') return base + 'border-radius:50%;background:' + color;
    if (kind === 'half') return 'display:block;flex:none;width:' + z + 'px;height:' + (z / 2) + 'px;border-radius:' + z + 'px ' + z + 'px 0 0;background:' + color;
    if (kind === 'square') return base + 'background:' + color;
    if (kind === 'ring') return base + 'box-sizing:border-box;border-radius:50%;border:' + Math.round(z * 0.28) + 'px solid ' + color;
    if (kind === 'diamond') return base + 'background:' + color + ';transform:rotate(45deg) scale(.74)';
    if (kind === 'quarter') return base + 'border-top-right-radius:100%;background:' + color;
    if (kind === 'tri') return base + 'clip-path:polygon(0 100%,100% 0,100% 100%);background:' + color;
    if (kind === 'arch') return base + 'border-radius:0 0 ' + (z / 2) + 'px ' + (z / 2) + 'px;background:' + color;
    if (kind === 'cross') return base + 'clip-path:polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%);background:' + color;
    if (kind === 'semi') return 'display:block;flex:none;width:' + z + 'px;height:' + (z / 2) + 'px;border-radius:0 0 ' + z + 'px ' + z + 'px;background:' + color;
    if (kind === 'peak') return base + 'clip-path:polygon(50% 0,100% 100%,0 100%);background:' + color;
    if (kind === 'dot') return base + 'border-radius:50%;background:' + color;
    if (kind === 'pill') return 'display:block;flex:none;width:' + z + 'px;height:' + Math.round(z * 0.55) + 'px;border-radius:' + z + 'px;background:' + color;
    return base + 'background:' + color;
  }
  pools() {
    return {
      warm: [['Arm circles', '30 s each way'], ["World's greatest stretch", '3 per side'], ['Hip circles', '5 each way'], ['Leg swings', '10 per side'], ['Inchworm', '5 slow reps']],
      strength: [['Incline push-up', '3 × 10'], ['Under-desk row', '3 × 8'], ['Cossack squat', '3 × 6 per side'], ['Glute bridge', '3 × 15'], ['Side plank', '3 × 20 s per side'], ['Pike push-up', '3 × 6'], ['Hollow hold', '3 × 20 s']],
      dance: [['Indian step', '2 rounds of 1 min'], ['Baby freeze', '5 tries, hold 3 s'], ['Six-step', '5 slow rounds'], ['Kick-outs', '3 × 8']],
      strikes: [['Jab-cross', '2 rounds of 1 min'], ['Front kick', '10 per side'], ['Hooks', '2 rounds of 1 min'], ['Knee strikes', '2 × 20']],
      stretch: [['Low lunge', '45 s per side'], ["Child's pose", '60 s'], ['Pigeon pose', '45 s per side'], ['Butterfly', '45 s'], ['Lying twist', '30 s per side']],
      mobility: [['90/90 hip switch', '8 per side'], ['Spine waves', '8 slow reps'], ['Deep squat hold', '60 s'], ['Shoulder circles', '10 each way'], ['Cossack squat', '6 per side']]
    };
  }
  plan() {
    const s = this.state, F = this.fams(), BK = this.bank(), U = this.unlocked(s.levels);
    const t = s.time;
    const n = (t <= 10 ? [1, 2, 1, 1] : t <= 20 ? [2, 3, 2, 2] : t <= 35 ? [2, 4, 2, 3] : [3, 5, 3, 3]).slice();
    if (s.energy < 34) { n[1] = Math.max(1, n[1] - 1); n[3] += 1; }
    if (s.energy >= 67) { n[1] += 1; }
    if (s.mood === 'Chill') { n[1] = 0; n[3] += 1; }
    const lv = (k) => s.levels[k] || 0;
    const used = {};
    const choose = (cands, k) => {
      const c = cands.filter((m) => !used[m.n]);
      if (!c.length) return null;
      const m = c[(this.hash(k) + s.seed * 3 + (s.swaps[k] || 0)) % c.length];
      used[m.n] = true;
      return m;
    };
    const atLevel = (fam) => { const L = lv(fam); let c = BK.filter((m) => m.fam === fam && m.lvl === L); if (!c.length) c = BK.filter((m) => m.fam === fam && m.lvl <= L); return c; };
    const upTo = (fam) => BK.filter((m) => m.fam === fam && m.lvl <= lv(fam) + 1);
    const rot = ['push', 'pull', 'legs', 'core', 'balance'].concat(U.crawls ? ['crawls'] : []);
    const off = (s.seed + new Date().getDate()) % rot.length;
    const PLAY = {
      Dance: { name: 'Dance', fams: ['dance'].concat(U.freezes ? ['freezes'] : []), color: '#FFC20E', shape: 'quarter' },
      Strikes: { name: 'Strikes', fams: ['strikes'].concat(U.flow ? ['flow'] : []), color: '#161616', shape: 'tri' },
      Strength: { name: 'Extra strength', fams: rot.slice().reverse(), color: '#F26A0F', shape: 'square' },
      Stretch: { name: 'Extra stretch', fams: ['stretch'].concat(U.splits ? ['splits'] : []), color: '#F6A5A9', shape: 'arch', loose: true },
      Chill: { name: 'Easy mobility', fams: ['mobility'], color: '#0E8178', shape: 'pill', loose: true },
      Surprise: { name: 'Surprise', fams: ['dance', 'strikes'].concat(Object.keys(U)), color: '#1556C2', shape: 'half' }
    };
    const pl = PLAY[s.mood] || PLAY.Surprise;
    const blocks = [];
    const mk = (key, name, color, shape, picks) => blocks.push({ key, name, color, shape, moves: picks.filter(Boolean).map((m, i) => ({ id: key + i, n: m.n, rx: m.rx, block: name, fam: m.fam, color: F[m.fam].color, ink: F[m.fam].ink, pose: 'walk', swapCount: s.swaps[key + i] || 0 })) });
    const warmPool = upTo('mobility').concat(BK.filter((m) => m.fam === 'cond' && m.role === 'w'));
    mk('warm', 'Warm up', '#0E8178', 'pill', Array.from({ length: n[0] }, (_, i) => choose(warmPool, 'warm' + i)));
    mk('strength', 'Strength', '#E5282E', 'circle', Array.from({ length: n[1] }, (_, i) => choose(atLevel(rot[(off + i) % rot.length]), 'strength' + i)));
    mk('play', pl.name, pl.color, pl.shape, Array.from({ length: n[2] }, (_, i) => { const fam = pl.fams[(s.seed + i) % pl.fams.length]; return choose(pl.loose ? upTo(fam) : atLevel(fam), 'play' + i); }));
    if (s.energy >= 67 && s.mood !== 'Chill') mk('finish', 'Finisher', '#C08A00', 'square', [choose(BK.filter((m) => m.fam === 'cond' && m.role === 'f'), 'finish0')]);
    const coolPool = upTo('stretch').concat(U.splits ? atLevel('splits') : []);
    mk('cool', 'Stretch & yoga', '#F6A5A9', 'arch', Array.from({ length: n[3] }, (_, i) => choose(coolPool, 'cool' + i)));
    return blocks.filter((b) => b.moves.length);
  }
  flat() { return this.plan().reduce((a, b) => a.concat(b.moves), []); }
  per() { const f = this.flat(); return Math.max(20, Math.round(this.state.time * 60 / f.length)); }
  swipeTo(screen, extra) {
    const order = ['checkin', 'paths', 'explore', 'you'];
    const dir = order.indexOf(screen) >= order.indexOf(this.state.screen) ? 'swl' : 'swr';
    this.setState(Object.assign({ screen, swipe: dir, expanding: false }, extra || {}));
  }
  transitionTo(screen, color, extra) {
    this.setState({ expanding: true, expandColor: color });
    clearTimeout(this.tt);
    this.tt = setTimeout(() => this.setState(Object.assign({ screen, expanding: false }, extra || {})), 360);
  }
  tick() {
    const s = this.state;
    if (s.screen !== 'player' || s.paused) return;
    if (s.remaining > 1) { if (s.remaining <= 4) this.beep(660, 0.12); this.setState({ remaining: s.remaining - 1 }); return; }
    this.beep(s.resting ? 990 : 880, 0.35);
    if (s.resting) this.endRest(); else this.finishMove();
  }
  isStrengthMove(m) {
    const mi = m && this.moveInfo()[m.n];
    return !!mi && ['push', 'pull', 'legs', 'core', 'balance'].indexOf(mi.fam) >= 0;
  }
  finishMove() {
    const f = this.flat(), s = this.state;
    const tried = Object.assign({}, s.tried); if (f[s.idx]) tried[f[s.idx].n] = true;
    if (s.idx + 1 >= f.length) { this.finish(tried); return; }
    this.setState({ tried, resting: true, remaining: 15, askFb: this.isStrengthMove(f[s.idx]), fbMsg: '' });
  }
  endRest() { this.setState({ resting: false, askFb: false, idx: this.state.idx + 1, remaining: this.per() }); }
  skip() {
    const f = this.flat(), s = this.state;
    if (s.resting) { this.endRest(); return; }
    if (s.idx + 1 >= f.length) { this.finish(s.tried); return; }
    this.setState({ idx: s.idx + 1, remaining: this.per(), askFb: false, fbMsg: '' });
  }
  finish(tried) {
    const plan = this.plan(), F = this.fams(), MI = this.moveInfo();
    const play = plan.find((b) => b.key === 'play') || plan[0];
    const famKey = (play && play.moves[0] && MI[play.moves[0].n]) ? MI[play.moves[0].n].fam : 'push';
    const history = Object.assign({}, this.state.history); const nd = new Date(); history[nd.getFullYear() + '-' + (nd.getMonth() + 1) + '-' + nd.getDate()] = F[famKey] ? famKey : 'push';
    this.setState({ tried: tried || this.state.tried, history, resting: false, askFb: false });
    this.transitionTo('done', '#FFC20E');
  }
  feedback(kind) {
    const s = this.state, f = this.flat();
    const m = f[s.idx]; const mi = m && this.moveInfo()[m.n];
    if (!mi) return;
    const levels = Object.assign({}, s.levels);
    const fam = this.fams()[mi.fam];
    let msg = 'Got it. Same level next time.';
    if (kind === 'easy' && levels[mi.fam] < 4) { levels[mi.fam] += 1; msg = 'Nice! ' + fam.name + ' moves up a step.'; }
    if (kind === 'hard' && levels[mi.fam] > 0) { levels[mi.fam] -= 1; msg = 'No worries, ' + fam.name + ' eases back a step.'; }
    if (kind === 'easy' && msg.indexOf('Nice') < 0) msg = 'You are at the top of ' + fam.name + '!';
    const was = this.unlocked(s.levels), now = this.unlocked(levels);
    if (Object.keys(now).some((k) => !was[k])) msg += ' A hidden path just unlocked!';
    this.setState({ levels, fb: s.fb + 1, askFb: false, fbMsg: msg });
  }
  openMove(name, from) { this.setState({ moveOpen: name, moveFrom: from }); this.transitionTo('move', '#FFFFFF'); }
  renderVals() {
    const s = this.state;
    const PHRASES = [
      ["How's", 'your', 'body?'], ['Feeling', 'groovy?'], ["Let's get", 'noodly.'], ['Ready', 'to', 'wiggle?'],
      ['Loosen up,', 'butter-', 'cup.'], ['Bend,', "don't", 'break.'], ['See you,', 'space', 'cowboy...'],
      ['Whatever', 'happens,', 'happens.'], ['They say', 'hunger is', 'the best', 'spice.'], ['Wiener', 'takes', 'all.'],
      ['Stretch', 'it out,', 'champ.'], ["Today's", 'vibe?']
    ];
    const ph = PHRASES[s.phrase % PHRASES.length];
    const longest = Math.max.apply(null, ph.map((l) => l.length));
    const phSize = Math.min(70, Math.floor(300 / (longest * 0.56)), ph.length > 3 ? 56 : 70);
    const tp = (s.time - 5) / 55 * 100;
    const ep = s.energy;
    const eCol = ep < 34 ? '#FFC20E' : ep < 67 ? '#F26A0F' : '#E5282E';
    const triH = Math.round(22 + ep * 0.34);
    const dot = Math.round(18 + (s.time - 5) * 0.72);
    const track = (p, c) => 'position:absolute;left:0;right:0;top:17px;height:10px;border-radius:5px;background:linear-gradient(to right,' + c + ' ' + p + '%,#E6E6E6 ' + p + '%)';
    const energyLabel = ep < 34 ? 'Low' : ep < 67 ? 'Medium' : 'High';
    const shapes = {
      Surprise: 'display:block;width:44px;height:22px;border-radius:22px 22px 0 0;background:#1556C2',
      Strength: 'display:block;width:40px;height:40px;border-radius:50%;background:#E5282E',
      Dance: 'display:block;width:40px;height:40px;border-top-right-radius:100%;background:#FFC20E',
      Strikes: 'display:block;width:40px;height:40px;clip-path:polygon(0 100%,100% 0,100% 100%);background:#161616',
      Stretch: 'display:block;width:40px;height:40px;border-radius:0 0 20px 20px;background:#F6A5A9',
      Chill: 'display:block;width:44px;height:24px;border-radius:44px;background:#0E8178'
    };
    const moods = Object.keys(shapes).map((l) => {
      const on = s.mood === l;
      return {
        l, on: on ? 'true' : 'false',
        pick: () => this.setState({ mood: l }),
        shape: shapes[l] + ';transition:transform .3s cubic-bezier(.2,.9,.3,1.3);transform:' + (on ? 'scale(1.15) rotate(-8deg)' : 'none'),
        lab: 'font-size:12px;font-weight:' + (on ? 800 : 500) + ';color:' + (on ? '#161616' : '#595959'),
        bar: 'display:block;height:4px;border-radius:2px;background:#161616;transition:width .3s;width:' + (on ? 22 : 0) + 'px'
      };
    });
    const mini = {
      ring: 'display:block;width:22px;height:22px;border-radius:50%;border:6px solid #0B7A3E;box-sizing:border-box',
      circle: 'display:block;width:22px;height:22px;border-radius:50%;background:#E5282E',
      quarter: 'display:block;width:22px;height:22px;border-top-right-radius:100%;background:#FFC20E',
      tri: 'display:block;width:22px;height:22px;clip-path:polygon(0 100%,100% 0,100% 100%);background:#F26A0F',
      arch: 'display:block;width:22px;height:22px;border-radius:0 0 11px 11px;background:#F6A5A9'
    };
    const plan = this.plan();
    const blocks = plan.map((b, bi) => ({
      name: b.name,
      count: b.moves.length + (b.moves.length === 1 ? ' move' : ' moves'),
      shape: this.shp(b.shape, b.color, 22),
      delay: 'animation-delay:' + (0.15 + bi * 0.08) + 's',
      moves: b.moves.map((m) => ({
        n: m.n, rx: m.rx, swapLabel: 'Swap ' + m.n, open: () => this.openMove(m.n, 'session'), shape: this.shp(this.fams()[m.fam].shape, this.fams()[m.fam].color, 14),
        row: 'display:flex;align-items:center;gap:10px;padding:8px 20px;border-left:0;animation:' + (m.swapCount % 2 ? 'swapA' : 'swapB') + ' .35s ease-out both',
        swap: () => { const sw = Object.assign({}, this.state.swaps); sw[m.id] = (sw[m.id] || 0) + 1; this.setState({ swaps: sw }); }
      }))
    }));
    const flat = plan.reduce((a, b) => a.concat(b.moves), []);
    const per = Math.max(20, Math.round(s.time * 60 / flat.length));
    const idx = Math.min(s.idx, flat.length - 1);
    const cur = flat[idx] || { n: '', rx: '', block: '', color: '#E5282E', ink: '#FFFFFF', pose: 'walk' };
    const C = 2 * Math.PI * 62;
    const frac = s.remaining / (s.resting ? 15 : per);
    const mm = Math.floor(s.remaining / 60), ss = s.remaining % 60;
    const confColors = ['#E5282E', '#FFC20E', '#1556C2', '#0B7A3E', '#F6A5A9', '#F26A0F'];
    const confShapes = ['border-radius:50%', 'border-top-right-radius:100%', 'clip-path:polygon(50% 0,100% 100%,0 100%)', 'border-radius:0', 'border-radius:14px 14px 0 0'];
    const confetti = [];
    for (let i = 0; i < 16; i++) {
      const x = (i * 53 + 17) % 360, y = i % 2 ? 560 + (i * 37) % 110 : 40 + (i * 97) % 140;
      const sz = 14 + (i * 7) % 18;
      confetti.push({ style: 'left:' + x + 'px;top:' + y + 'px;width:' + sz + 'px;height:' + (i % 5 === 4 ? sz / 2 : sz) + 'px;background:' + confColors[i % 6] + ';' + confShapes[i % 5] + ';animation-delay:' + (i * 0.05) + 's' });
    }
    const F = this.fams(), MI = this.moveInfo();
    const LVL = ['Foundation', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];
    const go = (screen, color, extra) => () => this.transitionTo(screen, color, extra);
    const toggleSt = (on, color) => ({
      track: 'width:52px;height:30px;padding:0;border:3px solid #161616;background:' + (on ? color : '#FFFFFF') + ';position:relative;transition:background .2s',
      knob: 'position:absolute;top:3px;left:' + (on ? 25 : 3) + 'px;width:18px;height:18px;background:#161616;transition:left .25s cubic-bezier(.3,1.6,.5,1)'
    });
    const U = this.unlocked(s.levels);
    const LAYOUT = [['push', 0, 0, 170, 150], ['pull', 170, 0, 100, 90], ['freezes', 270, 0, 80, 90], ['dance', 170, 90, 180, 60], ['legs', 0, 150, 110, 150], ['core', 110, 150, 130, 90], ['splits', 240, 150, 110, 90], ['crawls', 110, 240, 90, 60], ['strikes', 200, 240, 150, 60], ['stretch', 0, 300, 150, 170], ['balance', 150, 300, 110, 90], ['flow', 260, 300, 90, 90], ['mobility', 150, 390, 200, 80]];
    const cells = LAYOUT.map(([k, x, y, w, h]) => {
      const box = 'position:absolute;left:' + (x + 3) + 'px;top:' + (y + 3) + 'px;width:' + (w - 6) + 'px;height:' + (h - 6) + 'px;background:#FFFFFF;border:0;padding:0;overflow:hidden;text-align:left;cursor:pointer;font-family:Inter Tight,sans-serif';
      if (F[k].hidden && !U[k]) return { open: () => this.setState({ hint: 'Hidden path! Reach Intermediate in ' + F[F[k].parents[0]].name + ' and ' + F[F[k].parents[1]].name + ' to find out.' }), aria: 'Locked hidden path', box, fill: 'display:none', shape: 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#D6D6D6', name: '', label: 'display:none', lvl: 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#D0D0D0', lvlName: '?' };
      const fm = F[k], lv = s.levels[k], full = lv >= 4;
      return {
        open: () => { const seen = Object.assign({}, s.seen); seen[k] = true; this.setState({ pathOpen: k, seen, hint: '' }); },
        aria: fm.name + ' path, ' + LVL[lv],
        box: box + (fm.hidden && !s.seen[k] ? ';animation:flipIn .7s cubic-bezier(.2,.9,.3,1.2) both' : ''),
        fill: 'position:absolute;left:0;right:0;bottom:0;height:' + ((lv + 1) * 20) + '%;background:' + fm.color + ';transition:height .7s cubic-bezier(.3,1.4,.5,1)',
        shape: 'position:absolute;left:9px;top:9px;' + this.shp(fm.shape, full ? fm.ink : fm.color, 18),
        name: fm.name,
        label: 'position:absolute;left:34px;right:6px;top:10px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;line-height:1.1;color:' + (full ? fm.ink : '#161616'),
        lvl: 'position:absolute;left:9px;bottom:7px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:' + (((lv + 1) * 0.2 * h) >= 26 ? fm.ink : '#161616') + ';opacity:' + (h > 70 ? 1 : 0),
        lvlName: LVL[lv]
      };
    });
    const pk = s.pathOpen && F[s.pathOpen] ? s.pathOpen : 'push';
    const pf = F[pk], plv = s.levels[pk];
    const pdSteps = pf.steps.map((n, i) => ({
      n, here: i === plv,
      line: 'position:absolute;left:16px;top:' + (i === 0 ? 33 : 0) + 'px;bottom:' + (i === 4 ? 33 : 0) + 'px;width:4px;background:' + (i <= plv ? pf.color : '#E4E4E4'),
      dot: 'position:relative;flex:none;width:36px;height:36px;box-sizing:border-box;border-radius:50%;' + (i < plv ? 'background:' + pf.color : i === plv ? 'background:#FFFFFF;border:6px solid ' + pf.color : 'background:#FFFFFF;border:3px solid #E4E4E4'),
      text: 'font-size:17px;font-weight:' + (i === plv ? 900 : 600) + ';color:' + (i > plv ? '#8A8A8A' : '#161616')
    }));
    const mvName = s.moveOpen || 'Push-up';
    const mi = MI[mvName] || { fam: 'mobility', lvl: 0, role: 'v', cues: ['Move slowly and with control.', 'Breathe out on the effort.'], f: [], b: [] };
    const mf = F[mi.fam];
    const regionMap = (list, keys, color) => { const o = {}; keys.forEach((k) => { o[k] = list.indexOf(k) >= 0 ? color : '#E4E4E4'; }); return o; };
    const FK = ['shoulders', 'chest', 'arms', 'core', 'hips', 'legs'], BK = ['shoulders', 'arms', 'back', 'lowback', 'glutes', 'hamstrings'];
    const pretty = { shoulders: 'shoulders', chest: 'chest', arms: 'arms', core: 'core', hips: 'hips', legs: 'legs', back: 'upper back', lowback: 'lower back', glutes: 'glutes', hamstrings: 'hamstrings' };
    const works = []; mi.f.concat(mi.b).forEach((r) => { if (works.indexOf(pretty[r]) < 0) works.push(pretty[r]); });
    const fresh = Object.keys(U).filter((k) => !s.seen[k]);
    const mvFig = this.figure(mvName, s.calm);
    const mvSteps = F[mi.fam].steps;
    const mvEasier = mi.lvl > 0 ? mvSteps[mi.lvl - 1] : '';
    const mvHarder = mi.lvl < 4 ? (mi.role === 'm' ? mvSteps[mi.lvl + 1] : mvSteps[mi.lvl]) : '';
    const allMoves = Object.keys(MI);
    const q = s.query.trim().toLowerCase();
    const results = q ? allMoves.filter((n) => { const m = MI[n]; return n.toLowerCase().indexOf(q) >= 0 || F[m.fam].name.toLowerCase().indexOf(q) >= 0 || m.f.concat(m.b).some((r) => pretty[r].indexOf(q) >= 0); }).slice(0, 8) : [];
    const untried = allMoves.filter((n) => !s.tried[n]);
    const picks = [0, 1, 2].map((i) => untried[(s.seed * 3 + i * 7) % Math.max(1, untried.length)]).filter((n, i, a) => n && a.indexOf(n) === i);
    const now = new Date(), Y = now.getFullYear(), Mo = now.getMonth(), today = now.getDate();
    const firstDow = new Date(Y, Mo, 1).getDay(), dim = new Date(Y, Mo + 1, 0).getDate();
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const calCells = [];
    for (let i = 0; i < firstDow; i++) calCells.push({ n: '', box: 'height:44px', num: 'display:none', stamp: 'display:none' });
    for (let d = 1; d <= dim; d++) {
      const hk = s.history[Y + '-' + (Mo + 1) + '-' + d], fm = hk && F[hk];
      calCells.push({
        n: d,
        box: 'position:relative;height:44px;display:flex;align-items:center;justify-content:center;background:' + (d === today ? '#FFFFFF' : '#F4F4F4') + ';' + (d === today ? 'box-shadow:inset 0 0 0 3px #161616' : ''),
        num: 'position:absolute;left:4px;top:3px;font-size:9px;font-weight:700;color:' + (d > today ? '#B0B0B0' : '#595959'),
        stamp: fm ? this.shp(fm.shape, fm.color, 18) : 'display:none'
      });
    }
    const weekF = {}, weekB = {}; let daysMoved = 0;
    for (let d = Math.max(1, today - 6); d <= today; d++) {
      const hk = s.history[Y + '-' + (Mo + 1) + '-' + d]; if (!hk || !F[hk]) continue; daysMoved++;
      F[hk].f.forEach((r) => { weekF[r] = F[hk].color; }); F[hk].b.forEach((r) => { weekB[r] = F[hk].color; });
    }
    const fill = (src, keys) => { const o = {}; keys.forEach((k) => { o[k] = src[k] || '#E4E4E4'; }); return o; };
    const cT = toggleSt(s.calm, '#0E8178'), sT = toggleSt(s.sound, '#FFC20E'), chT = toggleSt(s.chatter, '#E5282E');
    const restLines = ['Sip some water!', 'Shake it out.', 'Breathe in... out.', 'You got this!'];
    return {
      hasBanner: fresh.length > 0,
      bannerText: fresh.length ? 'New path unlocked: ' + F[fresh[0]].name + '!' : '',
      bannerShape: fresh.length ? this.shp(F[fresh[0]].shape, F[fresh[0]].color, 22) : '',
      bannerGo: () => { if (!fresh.length) return; const seen = Object.assign({}, s.seen); seen[fresh[0]] = true; this.setState({ pathOpen: fresh[0], seen }); },
      mfg: mvFig,
      pfg: this.figure(cur.n, s.calm),
      hasEasier: !!mvEasier && mvEasier !== mvName, hasHarder: !!mvHarder && mvHarder !== mvName,
      mvEasier, mvHarder,
      openEasier: () => this.setState({ moveOpen: mvEasier }),
      openHarder: () => this.setState({ moveOpen: mvHarder }),
      startAll: () => { this.ensureAudio(); this.beep(880, 0.2); this.transitionTo('player', '#161616', { idx: 0, remaining: per, paused: false, resting: false, askFb: false, fbMsg: '' }); },
      rootClass: (s.calm ? 'calm ' : '') + (s.screen === 'player' ? 'isplayer' : ''),
      chatter: s.chatter,
      restLine: restLines[s.idx % restLines.length],
      showUpNext: !s.askFb && !s.fbMsg,
      askFb: s.askFb, hasFbMsg: !!s.fbMsg && !s.askFb, fbMsg: s.fbMsg,
      lastMove: cur.n,
      fbEasy: () => this.feedback('easy'), fbRight: () => this.feedback('right'), fbHard: () => this.feedback('hard'),
      navHome: () => this.swipeTo('checkin', { pathOpen: null }),
      navPaths: () => this.swipeTo('paths', { pathOpen: null }),
      navExplore: () => this.swipeTo('explore', { query: '' }),
      navYou: () => this.swipeTo('you'),
      tabClass: s.swipe || 'a-screen',
      isPaths: s.screen === 'paths', isMove: s.screen === 'move', isExplore: s.screen === 'explore', isYou: s.screen === 'you',
      pathsSub: s.fb < 3 ? 'Noodle is still learning your level. Tap Easy, Just right or Hard after moves and these fill in on their own.' : 'Your progress paints the picture. Tap a block to see its steps.',
      cells,
      nudgeText: s.hint ? s.hint : s.fb < 3 ? 'Not sure where you stand? No quiz needed. Just move and I will figure it out.' : 'Looking good! Tap a block to see what is next.',
      pathIsOpen: !!s.pathOpen,
      closePath: () => this.setState({ pathOpen: null, celebrate: false }),
      pd: { name: pf.name, lvlName: LVL[plv] + ' · step ' + (plv + 1) + ' of 5' },
      pdHead: 'position:relative;height:220px;flex:none;overflow:hidden;background:' + pf.color + ';color:' + pf.ink,
      pdBigShape: 'position:absolute;right:-30px;bottom:-30px;opacity:.25;' + this.shp(pf.shape, pf.ink, 170),
      pdSteps,
      celebrate: s.celebrate,
      pdNextLabel: plv < 4 ? 'Nailed it! Next step' : 'Mastered!',
      pdNext: () => { if (plv >= 4) return; const lv = Object.assign({}, s.levels); lv[pk] = plv + 1; clearTimeout(this.ct); this.setState({ levels: lv, celebrate: true }); this.ct = setTimeout(() => this.setState({ celebrate: false }), 1600); },
      pdEasier: () => { if (plv <= 0) return; const lv = Object.assign({}, s.levels); lv[pk] = plv - 1; this.setState({ levels: lv, celebrate: false }); },
      mvName, mvFam: { name: mf.name },
      mvStage: 'position:relative;height:340px;flex:none;overflow:hidden;background:' + mf.color + ';color:' + mf.ink,
      
      mvCues: mi.cues.map((c) => ({ t: c })),
      mvWorks: works.length ? works.join(', ').replace(/^./, (c) => c.toUpperCase()) : 'Whole body',
      mbf: regionMap(mi.f, FK, mf.color === '#161616' ? '#E5282E' : mf.color), mbb: regionMap(mi.b, BK, mf.color === '#161616' ? '#E5282E' : mf.color),
      mvFamShape: this.shp(mf.shape, mf.color, 22),
      mvOpenPath: go('paths', '#161616', { pathOpen: mi.fam }),
      closeMove: go(s.moveFrom, s.moveFrom === 'session' ? '#1556C2' : '#FFFFFF'),
      query: s.query, onQuery: (e) => this.setState({ query: e.target.value }),
      hasQuery: !!q, noQuery: !q,
      resultCount: results.length ? results.length + (results.length === 1 ? ' match' : ' matches') : 'No matches yet. Try hips, push or kick.',
      results: results.map((n) => ({ n, fam: F[MI[n].fam].name, shape: this.shp(F[MI[n].fam].shape, F[MI[n].fam].color, 18), open: () => this.openMove(n, 'explore') })),
      famTiles: Object.keys(F).filter((k) => k !== 'cond' && (!F[k].hidden || U[k])).map((k, i) => ({
        name: F[k].name,
        box: 'height:104px;border:0;padding:10px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;text-align:left;cursor:pointer;font-family:Inter Tight,sans-serif;background:' + F[k].color + ';color:' + F[k].ink + ';animation-delay:' + (i * 0.04) + 's',
        shape: this.shp(F[k].shape, F[k].ink, 28),
        open: go('paths', '#161616', { pathOpen: k })
      })),
      picks: picks.map((n) => ({ n, shape: this.shp(F[MI[n].fam].shape, F[MI[n].fam].color, 18), open: () => this.openMove(n, 'explore') })),
      monthName: MONTHS[Mo] + ' ' + Y,
      dow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x) => ({ t: x })),
      calCells,
      weekText: daysMoved ? 'You moved ' + daysMoved + (daysMoved === 1 ? ' day' : ' days') + ' this week. Colors show what got worked.' : 'Nothing yet this week. Whenever you are ready.',
      wbf: fill(weekF, FK), wbb: fill(weekB, BK),
      tight: ['Neck & shoulders', 'Upper back', 'Lower back', 'Hips', 'Hamstrings'].map((x) => ({ t: x, go: go('session', '#1556C2', { mood: 'Chill', time: 10, swaps: {}, idx: 0 }) })),
      calmOn: s.calm ? 'true' : 'false', calmTrack: cT.track, calmKnob: cT.knob, toggleCalm: () => this.setState({ calm: !s.calm }),
      soundOn: s.sound ? 'true' : 'false', soundTrack: sT.track, soundKnob: sT.knob, toggleSound: () => { this.ensureAudio(); this.setState({ sound: !s.sound }); },
      chatterOn: s.chatter ? 'true' : 'false', chatterTrack: chT.track, chatterKnob: chT.knob, toggleChatter: () => this.setState({ chatter: !s.chatter }),
      phraseLines: ph.map((l) => ({ t: l })),
      phEven: s.phrase % 2 === 0, phOdd: s.phrase % 2 === 1,
      phraseAria: ph.join(' ') + ' (tap for another)',
      nextPhrase: () => this.setState({ phrase: s.phrase + 1 }),
      phraseStyle: 'border:0;background:transparent;padding:0;text-align:left;cursor:pointer;color:#161616;font-family:Inter Tight,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.035em;line-height:.86;font-size:' + phSize + 'px',
      isCheckin: s.screen === 'checkin', isSession: s.screen === 'session', isPlayer: s.screen === 'player', isDone: s.screen === 'done',
      moods, time: s.time, energy: s.energy, energyLabel,
      onTime: (e) => this.setState({ time: Number(e.target.value) }),
      onEnergy: (e) => this.setState({ energy: Number(e.target.value) }),
      timeDot: 'display:block;border-radius:50%;background:#E5282E;transition:width .15s,height .15s;width:' + dot + 'px;height:' + dot + 'px',
      timeTrack: track(tp, '#E5282E'),
      energyTri: 'display:block;clip-path:polygon(50% 0,100% 100%,0 100%);transition:width .15s,height .15s,background .3s;background:' + eCol + ';height:' + triH + 'px;width:' + Math.round(triH * 1.1) + 'px',
      energyTrack: track(ep, eCol),
      go: () => this.transitionTo('session', '#1556C2', { swaps: {}, visited: true }),
      petHome: () => { clearTimeout(this.pt); this.setState({ homePets: s.homePets + 1, petting: true }); this.pt = setTimeout(() => this.setState({ petting: false }), 1300); },
      petting: s.petting,
      petWiggle: 'display:block;transform-origin:50% 100%;' + (s.homePets ? 'animation:' + (s.homePets % 2 ? 'wiggleA' : 'wiggleB') + ' .7s cubic-bezier(.3,.7,.4,1) both' : ''),
      openEyes: 'transition:opacity .15s;opacity:' + (s.petting ? 0 : 1),
      happyEyes: 'transition:opacity .15s;opacity:' + (s.petting ? 1 : 0),
      blush: 'transition:opacity .2s;opacity:' + (s.petting ? 1 : 0),
      earL: 'transform-box:fill-box;transform-origin:50% 0;transition:transform .3s cubic-bezier(.3,1.6,.5,1);transform:rotate(' + (s.petting ? 18 : 0) + 'deg)',
      earR: 'transform-box:fill-box;transform-origin:50% 0;transition:transform .3s cubic-bezier(.3,1.6,.5,1);transform:rotate(' + (s.petting ? -18 : 0) + 'deg)',
      heartsBox: 'position:absolute;left:0;top:0;width:96px;height:0;pointer-events:none',
      checkinClass: (s.swipe && s.screen === 'checkin' ? s.swipe : 'a-screen') + (s.visited ? ' quick' : ''),
      pet: () => this.setState({ pets: s.pets + 1 }),
      petStyle: s.pets ? 'animation:' + (s.pets % 2 ? 'hop' : 'hopB') + ' .7s cubic-bezier(.3,.7,.4,1) both' : '',
      home: () => this.transitionTo('checkin', '#FFFFFF', { idx: 0 }),
      shuffle: () => this.setState({ seed: s.seed + 1, swaps: {} }),
      summary: (s.mood === 'Chill' ? 'Chill day' : energyLabel + ' energy') + ' · ' + flat.length + ' moves · ' + (s.mood === 'Surprise' ? 'surprise' : s.mood.toLowerCase()),
      blocks,
      start: () => { this.ensureAudio(); this.beep(880, 0.2); }, startGo: () => this.transitionTo('player', '#161616', { idx: 0, remaining: per, paused: false, resting: false, askFb: false, fbMsg: '' }),
      stage: 'position:relative;height:500px;flex:none;overflow:hidden;color:' + (s.resting ? '#161616' : cur.ink) + ';background:' + (s.resting ? '#EDEDED' : cur.color) + ';transition:background .5s,color .5s',
      blockLabel: 'margin:0;font-size:12px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;opacity:.85',
      cur, pEven: !s.resting && idx % 2 === 0, pOdd: !s.resting && idx % 2 === 1,
      isStretchPose: cur.pose === 'stretch', isWalkPose: cur.pose !== 'stretch',
      segs: flat.map((m, i) => ({ style: 'flex:1;height:6px;border-radius:3px;transition:background .3s;background:' + (i < idx ? cur.ink : i === idx ? cur.ink : 'rgba(127,127,127,.35)') + ';opacity:' + (i === idx ? 1 : i < idx ? .7 : 1) })),
      ring: 'stroke:' + (s.resting ? '#161616' : cur.color === '#F6A5A9' ? '#E5282E' : cur.color === '#FFC20E' ? '#F26A0F' : cur.color) + ';stroke-dasharray:' + C + ';stroke-dashoffset:' + (C * (1 - frac)) + ';transition:stroke-dashoffset 1s linear',
      clock: mm + ':' + (ss < 10 ? '0' : '') + ss,
      pauseText: s.paused ? 'Resume' : 'Pause',
      pauseLabel: s.paused ? 'Resume' : 'Pause',
      togglePause: () => this.setState({ paused: !s.paused }),
      next: () => this.skip(),
      prev: () => this.setState(s.resting ? { resting: false, askFb: false, remaining: per } : { idx: Math.max(0, idx - 1), remaining: per }),
      exitPlayer: () => this.transitionTo('session', '#1556C2', { idx: 0 }),
      upNext: idx + 1 < flat.length ? flat[idx + 1].n : 'Finish!',
      resting: s.resting,
      confetti,
      doneSummary: s.time + ' min · ' + flat.length + ' moves · Noodle is proud',
      expanding: s.expanding,
      expandStyle: 'background:' + s.expandColor
    };
  }
}

bootNoodle(Component);
