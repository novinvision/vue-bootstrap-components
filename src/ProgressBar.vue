<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0,
            required: true,
        }
    }
}
</script>

<template>
    <div class="progress"
         role="progressbar"
         aria-valuemin="0" aria-valuemax="100"
         aria-label="Download progress"
         :aria-valuenow="value">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success"
             :style="{width: value + '%'}">
        </div>
    </div>
</template>
