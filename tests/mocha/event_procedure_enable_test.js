/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

goog.declareModuleId('Blockly.test.eventProcedureEnable');

import {assertEventFiredShallow, assertEventNotFired, createChangeListenerSpy} from './test_helpers/events.js';
import {sharedTestSetup, sharedTestTeardown} from './test_helpers/setup_teardown.js';


// TODO (#6519): Unskip.
suite.skip('Procedure Enable Event', function() {
  setup(function() {
    sharedTestSetup.call(this);
    this.workspace = new Blockly.Workspace();
    this.procedureMap = this.workspace.getProcedureMap();
    this.eventSpy = createChangeListenerSpy(this.workspace);
  });

  teardown(function() {
    sharedTestTeardown.call(this);
  });

  suite('running', function() {
    setup(function() {
      this.createProcedureModel = (id) => {
        return new Blockly.procedures.ObservableProcedureModel(
            this.workspace, 'test name');
      };

      this.createEventToState = (procedureModel) => {
        return new Blockly.Events.ProcedureEnable(procedureModel);
      };
    });

    suite('forward', function() {
      test('the procedure with the matching ID is toggled', function() {
        const initial = this.createProcedureModel('test id');
        const final = this.createProcedureModel('test id');
        final.setEnabled(!final.getEnabled());  // Set it to the non-default.
        const event = this.createEventToState(final);
        this.procedureMap.add(initial);

        event.run(true /* forward */);

        chai.assert.equal(
            initial.getEnabled(),
            final.getEnabled(),
            "Expected the procedure's enabled state to be flipped");
      });
  
      test('toggling a procedure fires an enable event', function() {
        const initial = this.createProcedureModel('test id');
        const final = this.createProcedureModel('test id');
        final.setEnabled(!final.getEnabled());  // Set it to the non-default.
        const event = this.createEventToState(final);
        this.procedureMap.add(initial);

        this.eventSpy.resetHistory();
        event.run(true /* forward */);

        assertEventFiredShallow(
            this.eventSpy,
            Blockly.Events.ProcedureEnable,
            {model: initial},
            this.workspace.id);
      });
  
      test('noop toggles do not fire enable events', function() {
        const initial = this.createProcedureModel('test id');
        const final = this.createProcedureModel('test id');
        const event = this.createEventToState(final);
        this.procedureMap.add(initial);

        this.eventSpy.resetHistory();
        event.run(true /* forward */);

        assertEventNotFired(
            this.eventSpy,
            Blockly.Events.ProcedureEnable,
            this.workspace.id);
      });
  
      test(
          'attempting to toggle a procedure that does not exist throws',
          function() {
            const initial = this.createProcedureModel('test id');
            const final = this.createProcedureModel('test id');
            final.setEnabled(!final.getEnabled());  // Set it to the non-default.
            const event = this.createEventToState(final);
    
            chai.assert.throws(() => {
              event.run(true /* forward */);
            });
          });
    });
  
    suite('backward', function() {
      test('the procedure with the matching ID is toggled', function() {
        const initial = this.createProcedureModel('test id');
        const undoable = this.createProcedureModel('test id');
        // Set them to be non-default.
        const defaultEnabled = initial.getEnabled();
        initial.setEnabled(!defaultEnabled);
        undoable.setEnabled(!defaultEnabled);
        const event = this.createEventToState(undoable);
        this.procedureMap.add(initial);

        event.run(false /* backward */);

        chai.assert.equal(
            initial.getEnabled(),
            defaultEnabled,
            "Expected the procedure's enabled state to be flipped");
      });
  
      test('toggling a procedure fires an enable event', function() {
        const initial = this.createProcedureModel('test id');
        const undoable = this.createProcedureModel('test id');
        // Set them to be non-default.
        const defaultEnabled = initial.getEnabled();
        initial.setEnabled(!defaultEnabled);
        undoable.setEnabled(!defaultEnabled);
        const event = this.createEventToState(undoable);
        this.procedureMap.add(initial);

        this.eventSpy.resetHistory();
        event.run(false /* backward */);

        assertEventFiredShallow(
            this.eventSpy,
            Blockly.Events.ProcedureEnable,
            {model: initial},
            this.workspace.id);
      });
  
      test('noop toggles do not fire enable events', function() {
        const initial = this.createProcedureModel('test id');
        const undoable = this.createProcedureModel('test id');
        // Set them to be non-default.
        const defaultEnabled = initial.getEnabled();
        undoable.setEnabled(!defaultEnabled);
        const event = this.createEventToState(undoable);
        this.procedureMap.add(initial);

        this.eventSpy.resetHistory();
        event.run(false /* backward */);

        assertEventNotFired(
            this.eventSpy,
            Blockly.Events.ProcedureEnable,
            {},
            this.workspace.id);
      });
  
      test(
          'attempting to toggle a procedure that does not exist throws',
          function() {
            const initial = this.createProcedureModel('test id');
            const undoable = this.createProcedureModel('test id');
            // Set them to be non-default.
            const defaultEnabled = initial.getEnabled();
            initial.setEnabled(!defaultEnabled);
            undoable.setEnabled(!defaultEnabled);
            const event = this.createEventToState(undoable);
    
            chai.assert.throws(() => {
              event.run(false /* backward */);
            });
          });
    });
  });
});
