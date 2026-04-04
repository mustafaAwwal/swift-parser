const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { compile } = require('./index.js');

function loadDesign(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'examples', name), 'utf-8');
}

function loadSnapshot(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'snapshots', name), 'utf-8');
}

describe('screen snapshots', () => {
  it('login', () => {
    assert.equal(compile(loadDesign('login.design')), loadSnapshot('login.swift'));
  });

  it('calorie onboarding 1', () => {
    assert.equal(compile(loadDesign('calorie-onboarding.design')), loadSnapshot('calorie-onboarding.swift'));
  });

  it('calorie onboarding 2', () => {
    assert.equal(compile(loadDesign('calorie-onboarding-2.design')), loadSnapshot('calorie-onboarding-2.swift'));
  });

  it('calorie onboarding 4', () => {
    assert.equal(compile(loadDesign('calorie-onboarding-4.design')), loadSnapshot('calorie-onboarding-4.swift'));
  });

  it('complex dashboard', () => {
    assert.equal(compile(loadDesign('complex-dashboard.design')), loadSnapshot('complex-dashboard.swift'));
  });
});
