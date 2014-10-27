<?php include_once 'Task.php'; ?>
<!DOCTYPE html>
<!-- Greg Potter -->
<html>
    <head>
        <meta charset="UTF-8">
        <title>Tasklist</title>
        <link rel="stylesheet" type="text/css" href="css/ui-lightness/jquery-ui-1.8.23.custom.css" />
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700">
        <link rel="stylesheet" type="text/css" href="css/style.css" />
    </head>
    <body>
        <h1>
            Task Manager
        </h1>
        <form action="index.php" method="post" id="tasks">
            <input type="hidden" name="cmd" value="Delete" />
            <table>
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Task</th>
                        <th>Type</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        for ($count = 0; $count < count($tasks); $count++) {
                            $task = $tasks[$count];                        
                            echo "<tr>";
                            echo "<td><input type=\"checkbox\" name=\"delete[]\" value=\"$task->id\" /></td>";
                            echo "<td>$task->description</td>";
                            echo "<td>$task->type</td>";
                            echo "<td>$task->duedate</td>";
                            echo "</tr>";
                        }
                    ?>
                </tbody>
            </table>
            <div class="form-group right">
                <input type="submit" value="Deleted Selected" id="delete" class="red" />
            </div>
        </form>
        <form action="index.php" method="post" id="add-form">
            <input type="hidden" name="cmd" value="Add" />
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" />
            </div>
            
            <div class="form-group">
                <label>Date</label>
                <input type="text" id="date" name="datedue" />
            </div>
            
            <div class="form-group">
                <label>Type</label>
                <select id="type" name="type">
                    <option>Next Action</option>
                    <option data-show-class="waiting">Waiting For</option>
                    <option data-show-class="talk-to">Talk To</option>
                    <option>Future</option>
                    <option>Someday/Maybe</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="show-class waiting">Waiting for:</label>
                <label class="show-class talk-to">Talk to:</label>
                <input type="text" class="show-class waiting talk-to" name="more" />
            </div>
            
            <div class="form-group right">
                <input type="submit" value="Add Task" class="green" />
            </div>
        </form>
        <script type="text/javascript" src="js/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.8.23.custom.min.js"></script>
        <script type="text/javascript" src="js/tasklist.js"></script>
    </body>
</html>
